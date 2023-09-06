import {
  getTransactionsSummaries,
  Provider,
  getReceiptsMessageOut,
} from 'fuels';
import type { PublicClient } from 'viem';

import { FUEL_MESSAGE_PORTAL } from '../contracts/FuelMessagePortal';

export const getWithdrawTransactions = async (
  address: string,
  providerUrl: string,
  ethPublicClient: PublicClient,
  numberOfTransactions = 1000
) => {
  const transactionsByOwner = await getTransactionsSummaries({
    provider: new Provider(providerUrl),
    filters: {
      owner: address,
      first: numberOfTransactions,
    },
  });

  const abiMessageRelayed = FUEL_MESSAGE_PORTAL.abi.find(
    ({ name, type }) => name === 'MessageRelayed' && type === 'event'
  );
  const blockNumbers = await Promise.all(
    transactionsByOwner.transactions.map(async (transaction) => {
      const messageOutReceipt = getReceiptsMessageOut(transaction.receipts)[0];

      const logs = await ethPublicClient.getLogs({
        address: process.env.ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
        event: {
          type: 'event',
          name: 'MessageRelayed',
          inputs: abiMessageRelayed?.inputs || [],
        },
        args: {
          messageId: messageOutReceipt?.messageId as `0x${string}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        fromBlock: 'earliest',
      });
      return logs[0]?.blockNumber || undefined;
    })
  );

  const pendingWithdrawTransactionsWithBlockHeights =
    transactionsByOwner.transactions.map((transaction, index) => {
      return {
        ...transaction,
        blockHeight: blockNumbers[index],
      };
    });

  return pendingWithdrawTransactionsWithBlockHeights;
};
