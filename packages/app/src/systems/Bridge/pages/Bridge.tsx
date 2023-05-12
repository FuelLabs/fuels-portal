import { cssObj } from '@fuel-ui/css';
import { Card, Box, Text, InputAmount, Alert, Link } from '@fuel-ui/react';

import { BridgeButton, BridgeTabs } from '../containers';
import { useBridge } from '../hooks';

import {
  EthAccountConnection,
  ethLogoSrc,
  FuelAccountConnection,
  isEthChain,
  isFuelChain,
} from '~/systems/Chains';

export const Bridge = () => {
  const { fromNetwork, toNetwork, assetAmount, assetBalance, handlers } =
    useBridge();

  if (!fromNetwork || !toNetwork) return null;

  return (
    <Card>
      <Card.Body>
        <BridgeTabs />
        <Box.Stack gap="$6">
          {Boolean(fromNetwork && toNetwork) && (
            <Box.Stack gap="$3">
              <Text fontSize="xs" css={styles.sectionHeader}>
                Network
              </Text>
              {isEthChain(fromNetwork) && <EthAccountConnection label="From" />}
              {isFuelChain(fromNetwork) && (
                <FuelAccountConnection label="From" />
              )}
              {isEthChain(toNetwork) && <EthAccountConnection label="To" />}
              {isFuelChain(toNetwork) && <FuelAccountConnection label="To" />}
            </Box.Stack>
          )}
          <InputAmount
            balance={assetBalance}
            asset={{
              name: 'ETH',
              imageUrl: ethLogoSrc,
            }}
            assetTooltip="Fuel Bridge only supports ETH for now. Other assets will be added soon."
            value={assetAmount}
            onChange={(val) => handlers.changeAssetAmount({ assetAmount: val })}
          />
          <BridgeButton />
          {isFuelChain(toNetwork) && (
            <Alert status="warning">
              <Alert.Description>
                <Text fontSize="sm">
                  Any assets deposited to Fuel takes 7 days to withdraw back to
                  Ethereum. Learn more about our architecture and security in
                  our
                  <Link href="https://fuel.sh/" isExternal>
                    docs
                  </Link>
                </Text>
              </Alert.Description>
            </Alert>
          )}
        </Box.Stack>
      </Card.Body>
    </Card>
  );
};

const styles = {
  sectionHeader: cssObj({
    fontWeight: '$bold',
  }),
};
