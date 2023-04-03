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
import { useConnectFuel } from '../../../../systems/Core/hooks/useConnectFuel';
import { useWallet } from '../../../../systems/Core/hooks/useWallet';

import { NetworkCard } from './NetworkCard';

export const BridgeCard = () => {
  const account = useAccount();
  const connect = useConnect({
    connector: new InjectedConnector(),
  });

  const wallet = useWallet();
  const connectFuel = useConnectFuel();

  const getButtonText = (
    isFromAccountConnected: boolean,
    isToAccountConnected: boolean
  ) => {
    if (!isFromAccountConnected && !isToAccountConnected) {
      return 'Connect wallets';
    }
    if (!isFromAccountConnected) {
      return 'Connect wallet 1';
    }
    if (!isToAccountConnected) {
      return 'Connect wallet 2';
    }
    return 'Deposit';
  };

  const buttonText = getButtonText(account.isConnected, !!wallet.data);

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
            address={
              !!wallet.data ? wallet.data?.address.toAddress() : undefined
            }
            isLoading={connectFuel.isLoading}
            onConnect={() => connectFuel.mutate()}
          />
          <Heading as="h5" fontColor="blackA12">
            Asset
          </Heading>
          <InputAmount />
          <Button onPress={() => {}} isDisabled={buttonText !== 'Deposit'}>
            {buttonText}
          </Button>
        </Stack>
      </Card.Body>
    </Card>
  );
};
