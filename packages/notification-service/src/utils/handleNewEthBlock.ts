import type { PrismaClient } from '@prisma/client';
import nodemailer from "nodemailer";
import type { ReceiptMessageOut } from 'fuels';
import {
  getTransactionsSummaries,
  Provider,
  Address,
  ChainName,
  ReceiptType,
} from 'fuels';
import type { PublicClient } from 'viem';
import { FUEL_CHAIN_STATE } from '~/contracts/FuelChainState';
import { FUEL_MESSAGE_PORTAL } from '~/contracts/FuelMessagePortal';

import MailService from '../services/mailService';

export const handleNewEthBlock = async (
  prisma: PrismaClient,
  fuelProviderUrl: string,
  ethPublicClient: PublicClient
) => {
  // const mailService = await MailService.getInstance();
  // console.log(`mailService.transporter`, mailService.transporter);
  const account = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  const abiFuelChainState = FUEL_CHAIN_STATE.abi.find(
    ({ name, type }) => name === 'CommitSubmitted' && type === 'event'
  );

  // Grab the last logs of commit state to the fuelChainState
  const logs = await ethPublicClient.getLogs({
    address: process.env.ETH_FUEL_CHAIN_STATE as `0x${string}`,
    event: {
      type: 'event',
      name: 'CommitSubmitted',
      inputs: abiFuelChainState?.inputs || [],
    },
    fromBlock: 'earliest',
  });

  const last5Logs = logs.slice(-5); // Remove the slice here to grab all the logs
  last5Logs.map(async (lastLog) => {
    const { blockHash } = lastLog.args as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    const fuelProvider = new Provider(fuelProviderUrl);
    try {
      const block = await fuelProvider.getBlock(blockHash);

      const addresses = await prisma.address.findMany({
        include: {
          withdrawer: true,
        },
      });

      addresses.forEach(async ({ address }) => {
        const owner = Address.fromString(address).toB256();

        const transactionsByOwner = await getTransactionsSummaries({
          provider: fuelProvider,
          filters: {
            owner,
            first: 1000,
          },
        });

        // Filter all transaction that have a withdraw to ETH
        const withdrawTransactions = transactionsByOwner.transactions.filter(
          (t) => {
            return t.operations.find((o) => o.to?.chain === ChainName.ethereum);
          }
        );

        // Get the blocks that need to be notified
        const withdrawsWithBlocks = await Promise.all(
          withdrawTransactions.map(async (tranasction) => {
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
              fromBlock: 'earliest',
            });

            const isAlreadyRelayed = !!logs[0];

            const isReady = tranasction.blockId
              ? (await fuelProvider.getBlock(tranasction.blockId))?.height.lte(
                  block?.height || 0
                )
              : false;

            return {
              tranasction,
              block,
              isAlreadyRelayed,
              isReady,
            };
          })
        );

        for (const w of withdrawsWithBlocks) {
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
                },
              },
            },
          });
          if (!dbTransaction && w.tranasction.id && w.tranasction.status) {
            dbTransaction = await prisma.transaction.create({
              data: {
                transactionId: w.tranasction.id,
                status: w.tranasction.status,
                address: {
                  connect: {
                    address: owner,
                  },
                },
                blockHeight: w.block?.height.toNumber(),
              },
              include: {
                address: {
                  include: {
                    withdrawer: true,
                  },
                },
              },
            });
          }
          if (
            w.isReady &&
            !w.isAlreadyRelayed &&
            dbTransaction &&
            !dbTransaction.emailSent
          ) {
            //console.log(`dbTransaction`, dbTransaction);
            console.log('0');
            // await mailService.sendMail({
            //   from: 'matt.auer@fuel.sh',
            //   to: dbTransaction.address.withdrawer.email,
            //   subject: 'Withdraw Notification',
            //   text: `Your transaction ${w.tranasction.id} is ready for withdrawal`,
            //   html: `<p>Your transaction ${w.tranasction.id} is ready for withdrawal<p>`,
            // });
            // console.log(
            //   `dbTransaction.transactionId`,
            //   dbTransaction.transactionId
            // );
            await transporter.sendMail({
              from: `"Fred Foo" matt.auer@fuel.sh`,
              to: dbTransaction.address.withdrawer.email,
              subject: 'Withdraw Notification',
              text: `Your transaction ${w.tranasction.id} is ready for withdrawal`,
              html: `<p>Your transaction ${w.tranasction.id} is ready for withdrawal<p>`,
            });
            console.log('two');
            // Update the message is sent
            const newTx = await prisma.transaction.update({
              where: { transactionId: dbTransaction.transactionId },
              data: { emailSent: true },
            });
            console.log(`newTx`, newTx);
          }
        }

        // withdrawsWithBlocks.forEach(async (w) => {
        //   // Message is already sent
        //   // Check if the email was already sent
        //   let dbTransaction = await prisma.transaction.findUnique({
        //     where: {
        //       transactionId: w.tranasction.id,
        //     },
        //     include: {
        //       address: {
        //         include: {
        //           withdrawer: true,
        //         },
        //       },
        //     },
        //   });
        //   if (!dbTransaction && w.tranasction.id && w.tranasction.status) {
        //     dbTransaction = await prisma.transaction.create({
        //       data: {
        //         transactionId: w.tranasction.id,
        //         status: w.tranasction.status,
        //         address: {
        //           connect: {
        //             address: owner,
        //           },
        //         },
        //         blockHeight: w.block?.height.toNumber(),
        //       },
        //       include: {
        //         address: {
        //           include: {
        //             withdrawer: true,
        //           },
        //         },
        //       },
        //     });
        //   }
        //   if (
        //     w.isReady &&
        //     !w.isAlreadyRelayed &&
        //     dbTransaction &&
        //     !dbTransaction.emailSent
        //   ) {
        //     console.log(`dbTransaction`, dbTransaction);
        //     await mailService.sendMail({
        //       from: 'matt.auer@fuel.sh',
        //       to: dbTransaction.address.withdrawer.email,
        //       subject: 'Withdraw Notification',
        //       text: `Your transaction ${w.tranasction.id} is ready for withdrawal`,
        //       html: `<p>Your transaction ${w.tranasction.id} is ready for withdrawal<p>`,
        //     });
        //     console.log(`dbTransaction.transactionId`, dbTransaction.transactionId);
        //     // Update the message is sent
        //     const newTx = await prisma.transaction.update({
        //       where: { transactionId: dbTransaction.transactionId },
        //       data: { emailSent: true },
        //     });
        //     console.log(`newTx`, newTx);
        //   }
        // });
      });
    } catch (e) {
      console.error(e);
      console.log('Not finalized yet');
    }
  });
};
