import { cssObj } from '@fuel-ui/css';
import { Card, Box, Text } from '@fuel-ui/react';

import { BridgeButton, BridgeTabs } from '../containers';
import { useBridge } from '../hooks';

import {
  EthAccountConnection,
  FuelAccountConnection,
  isEthChain,
  isFuelChain,
} from '~/systems/Chains';

export const Bridge = () => {
  const { fromNetwork, toNetwork } = useBridge();

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
          <BridgeButton />
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
