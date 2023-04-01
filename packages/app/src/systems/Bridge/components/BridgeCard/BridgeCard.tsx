import {
  Button,
  ButtonGroup,
  Card,
  Heading,
  InputAmount,
  Stack,
} from '@fuel-ui/react';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useConnectFuel } from '~/systems/Core';
import { useWallet } from '~/systems/Core';

import { NetworkCard } from './NetworkCard';

const buttonText = 'Connect wallets';

export const BridgeCard = () => {
  const account = useAccount();
  const connect = useConnect({
    connector: new InjectedConnector(),
  });

  const wallet = useWallet();
  const connectFuel = useConnectFuel();

  return (
    <Card css={{ background: '$whiteA12' }}>
      <Card.Header justify="center">
        <ButtonGroup>
          <Button>Deposit</Button>
          <Button>Withdraw</Button>
        </ButtonGroup>
      </Card.Header>
      <Card.Body>
        <Stack>
          <Heading as="h5" fontColor="blackA12">
            Network
          </Heading>
          <NetworkCard
            network="Ethereum"
            networkImageUrl="public/fuel-logo.svg"
            heading="From"
            isLoading={connect.isLoading}
            onConnect={connect.connect}
            address={account.address}
          />
          <NetworkCard
            network="Fuel"
            networkImageUrl="public/fuel-logo.svg"
            heading="To"
            address={wallet.wallet?.address.toAddress()}
            isLoading={connectFuel.isLoading}
            onConnect={() => connectFuel.mutate()}
          />
          <Heading as="h5" fontColor="blackA12">
            Asset
          </Heading>
          <InputAmount />
          <Button>{buttonText}</Button>
        </Stack>
      </Card.Body>
    </Card>
  );
};
