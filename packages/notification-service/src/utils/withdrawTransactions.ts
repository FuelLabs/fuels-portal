import type { ReceiptMessageOut } from 'fuels';
import { ReceiptType, ReceiptCoder, arrayify } from 'fuels';
import type { PublicClient } from 'viem';

import { FUEL_MESSAGE_PORTAL } from '../contracts/FuelMessagePortal';

import { getGraphqlClient } from './graphql';

export const getWithdrawTransactions = async (
  address: string,
  providerUrl: string,
  ethPublicClient: PublicClient,
  numberOfTransactions = 1000
) => {
  const { transactionsByOwner } = await getGraphqlClient(
    providerUrl
  ).AddressTransactions({
    owner: address,
    first: numberOfTransactions,
  });

  const abiMessageRelayed = FUEL_MESSAGE_PORTAL.abi.find(
    ({ name, type }) => name === 'MessageRelayed' && type === 'event'
  );
  const logs = await Promise.all(
    transactionsByOwner.edges.map(async (edge) => {
      const decodedReceipts = (edge.node.receipts || []).map(
        ({ rawPayload }) => {
          const [decoded] = new ReceiptCoder().decode(arrayify(rawPayload), 0);

          return decoded;
        }
      );

      const messageOutReceipt = decodedReceipts.find(
        ({ type }) => type === ReceiptType.MessageOut
      ) as ReceiptMessageOut;

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
      return logs;
    })
  );
  const pendingWithdrawTransactions = transactionsByOwner.edges.filter(
    (_, index) => {
      return !logs[index].length;
    }
  );
  return pendingWithdrawTransactions;
};
