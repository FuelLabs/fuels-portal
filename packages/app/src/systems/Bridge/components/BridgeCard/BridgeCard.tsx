import { Provider } from '@ethersproject/providers';
import {
  Button,
  ButtonGroup,
  Card,
  Heading,
  InputAmount,
  Stack,
} from '@fuel-ui/react';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useNonFuelProvider } from '../../../..//systems/Core/hooks/useNonFuelProvider';
import { useConnectFuel } from '../../../../systems/Core/hooks/useConnectFuel';
import { useWallet } from '../../../../systems/Core/hooks/useWallet';
import { useBridgeDeposit } from '../../hooks/useBridgeDeposit';

import { NetworkCard } from './NetworkCard';

const l1ChainDecimals = 18;

export const BridgeCard = () => {
  const account = useAccount();
  const connect = useConnect({
    connector: new InjectedConnector(),
  });
  //   const nonFuelProvider = useNonFuelProvider();
  const nonFuelProvider = new ethers.providers.JsonRpcProvider(
    process.env.VITE_NON_FUEL_PROVIDER_URL!
  ).getSigner(account.address);

  const wallet = useWallet();
  const connectFuel = useConnectFuel();

  const [depositAmount, setDepositAmount] = useState('');
  const bridgeDeposit = useBridgeDeposit(
    depositAmount,
    nonFuelProvider,
    wallet.data
  );

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
          <InputAmount
            units={l1ChainDecimals}
            onChange={(e) => setDepositAmount(e.toString())}
          />
          <Button
            onPress={() => bridgeDeposit.mutate()}
            isDisabled={buttonText !== 'Deposit'}
          >
            {buttonText}
          </Button>
        </Stack>
      </Card.Body>
    </Card>
  );
};
