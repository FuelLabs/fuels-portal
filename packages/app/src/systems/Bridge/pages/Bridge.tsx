import { cssObj } from '@fuel-ui/css';
import { Card, Stack, Text } from '@fuel-ui/react';

import fuelLogoSrc from '../../../../public/fuel-logo.svg';
import { BridgeButton, BridgeTabs } from '../containers';
import { useBridge } from '../hooks';

import { AccountConnectionInput } from '~/systems/Accounts';
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
      <Card.Header justify="center" css={styles.header}>
        <BridgeTabs />
      </Card.Header>
      <Card.Body>
        <Stack gap="$6">
          {Boolean(fromNetwork && toNetwork) && (
            <Stack gap="$3">
              <Text fontSize="xs" css={styles.sectionHeader}>
                Network
              </Text>
              {isEthChain(fromNetwork) && <EthAccountConnection label="From" />}
              {isFuelChain(fromNetwork) && (
                <FuelAccountConnection label="From" />
              )}
              {isEthChain(toNetwork) && <EthAccountConnection label="To" />}
              {isFuelChain(toNetwork) && <FuelAccountConnection label="To" />}
            </Stack>
          )}
          <BridgeButton />
        </Stack>
      </Card.Body>
    </Card>
  );
};

const styles = {
  header: cssObj({
    px: '$8',
    pt: '$8',
    pb: '$4',
  }),
  sectionHeader: cssObj({
    fontWeight: '$bold',
  }),
};
