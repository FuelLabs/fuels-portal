import type { PrismaClient } from '@prisma/client';
import type { ReceiptMessageOut } from 'fuels';
import {
  getTransactionsSummaries,
  Provider,
  Address,
  ChainName,
  ReceiptType,
} from 'fuels';
import type { PublicClient } from 'viem';
import { getContract } from 'viem';
import { FUEL_CHAIN_STATE } from '~/contracts/FuelChainState';
import { FUEL_MESSAGE_PORTAL } from '~/contracts/FuelMessagePortal';
import MailService from "../services/mailService";

// import { getWithdrawTransactions } from './withdrawTransactions';

export const handleNewEthBlock = async (
  prisma: PrismaClient,
  fuelProviderUrl: string,
  ethPublicClient: PublicClient
) => {
  // Create the instance of the fuelChainState contract from ETH
  //const fuelChainState = getContract({
  //     abi: FUEL_CHAIN_STATE.abi,
  //     address: process.env.ETH_FUEL_CHAIN_STATE as `0x${string}`,
  //     publicClient: ethPublicClient,
  //   });
  //   const fuelMessagePortal = getContract({
  //     abi: FUEL_MESSAGE_PORTAL.abi,
  //     address: process.env.ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
  //     publicClient: ethPublicClient,
  //   });
  const abiFuelChainState = FUEL_CHAIN_STATE.abi.find(
    ({ name, type }) => name === 'CommitSubmitted' && type === 'event'
  );

  // Grap the last logs of commit state to the fuelChainState
  const logs = await ethPublicClient.getLogs({
    address: process.env.ETH_FUEL_CHAIN_STATE as `0x${string}`,
    event: {
      type: 'event',
      name: 'CommitSubmitted',
      inputs: abiFuelChainState?.inputs || [],
    },
    fromBlock: 'earliest' as any, // eslint-disable @typescript-eslint/no-explicit-any
  });

  // Grab the 3rd to last
  const last5Logs = logs.slice(-5); // Remove the slice here to grab all the logs
  last5Logs.map(async (lastLog) => {
    const { blockHash } = lastLog.args as any;

    const fuelProvider = new Provider(fuelProviderUrl);
    try {
      // Check if the block is finalized or not
      const block = await fuelProvider.getBlock(blockHash);
      //console.log(block.height.toString());
      //   const isFinalized = await fuelChainState.read.finalized([
      //     blockHash,
      //     block.height.toString(),
      //   ]);

      const addresses = await prisma.address.findMany({
        include: {
          withdrawer: true,
        },
      });

      addresses.forEach(async ({ address }) => {
        // Grap the owner
        const owner = Address.fromString(address).toB256();
        // Grap all the withdraws from the Owner
        const transactionsByOwner = await getTransactionsSummaries({
          provider: fuelProvider,
          filters: {
            owner,
            first: 1000,
          },
        });
        // Filter all transaction that have a withdrw to ETH
        const withdrawTransactions = transactionsByOwner.transactions.filter(
          (t) => {
            return t.operations.find((o) => o.to.chain === ChainName.ethereum);
          }
        );

        // Get the blocks that need to be notified
        const withdrawsWithBlocks = await Promise.all(
          withdrawTransactions.map(async (tranasction) => {
            const blockOfTransaction = await fuelProvider.getBlock(
              tranasction.blockId
            );
            const messageReceipt = tranasction.receipts.find(
              (r) => r.type === ReceiptType.MessageOut
            ) as ReceiptMessageOut;
            const abiMessageRelayed = FUEL_MESSAGE_PORTAL.abi.find(
              ({ name, type }) => name === 'MessageRelayed' && type === 'event'
            );
            const logs = await ethPublicClient.getLogs({
              address: process.env.ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
              event: {
                type: 'event',
                name: 'MessageRelayed',
                inputs: abiMessageRelayed?.inputs || [],
              },
              args: {
                messageId: messageReceipt?.messageId as `0x${string}`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any,
              fromBlock: 'earliest' as any,
            });
            const isAlreadyRelayed = !!logs[0];

            return {
              tranasction,
              block,
              isAlreadyRelayed,
              isReady: blockOfTransaction.height.lte(block.height),
            };
          })
        );
        //

        withdrawsWithBlocks.forEach(async (w) => {
          // Message is already sent
          // Check if the email was already sent
          let dbTransaction = await prisma.transaction.findUnique({
            where: {
                transactionId: w.tranasction.id,
            },
            include: {
                address: {
                    include: {
                        withdrawer: true,
                    }
                }
            }
          });
          if (!dbTransaction && w.tranasction.id && w.tranasction.status) {
            dbTransaction = await prisma.transaction.create({
                data: {
                    transactionId: w.tranasction.id,
                    status: w.tranasction.status,
                    address: {
                        connect: {
                            address: owner,
                        }
                    },
                    blockHeight: w.block?.height.toNumber(),
                    messageId: "",
                },
                include: {
                    address: {
                        include: {
                            withdrawer: true,
                        }
                    }
                }
            });
          }
          if (w.isReady && !w.isAlreadyRelayed && dbTransaction && !dbTransaction.emailSent) {
            const mailService = MailService.getInstance();
            await mailService.sendMail({ from: "matt.auer@fuel.sh", to: dbTransaction.address.withdrawer.email, subject: "test", text: "test", html: "<b>Test<b>"});
            // Update the message is sent
            await prisma.transaction.update({
                where: { transactionId: dbTransaction.transactionId },
                data: { emailSent: true },
            });
          }
        });
      });
    } catch (e) {
      console.error(e);
      console.log('Not finalized yet');
    }
  });
};
