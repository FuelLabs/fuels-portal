import * as dotenv from 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';
import { Provider, Address } from 'fuels';

import { getGraphqlClient } from './utils/graphql';

dotenv.config();

const notificationServer = express();
const port = 3005;
const fuelTestAddress = new Address(
  'fuel1jraekwq3e2f8fn7ldypjvvy3zqgzgf99supvcylzhxqvrr0mx3nqdnzpvw'
);

const fuelProvider = new Provider(process.env.FUEL_PROVIDER_URL || '');

const getWithdrawTransactions = async (
  address: string,
  providerUrl: string,
  numberOfTransactions = 1000
) => {
  const { transactionsByOwner } = await getGraphqlClient(
    providerUrl
  ).AddressTransactions({
    owner: address,
    first: numberOfTransactions,
  });
  return transactionsByOwner;
};

notificationServer.get('/', (req: Request, res: Response) => {
  res.send('hello');
});

notificationServer.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`Notification server running at http://localhost:${port}`);
  const transactions = await getWithdrawTransactions(
    fuelTestAddress.toB256(),
    fuelProvider.url
  );
  console.log(`transactions`, JSON.stringify(transactions, null, 4));
});
