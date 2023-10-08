import { cssObj } from '@fuel-ui/css';
import { Card, Box, Text, InputAmount, Alert, Link } from '@fuel-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { getAssetEth } from '~/systems/Assets/utils';
import {
  EthAccountConnection,
  FuelAccountConnection,
  isEthChain,
  isFuelChain,
} from '~/systems/Chains';

import { BridgeButton, BridgeTabs } from '../containers';
import { useBridge } from '../hooks';

export const Bridge = () => {
  const {
    ethAddress,
    fuelAddress,
    fromNetwork,
    toNetwork,
    assetAmount,
    assetBalance,
    asset,
    handlers,
  } = useBridge();

  const fromControls = useAnimationControls();
  const toControls = useAnimationControls();

  if (!fromNetwork || !toNetwork) return null;

  const ethAssetAddress = asset ? getAssetEth(asset)?.address : undefined;

  return (
    <Card>
      <Card.Body css={styles.cardBody}>
        <BridgeTabs fromControls={fromControls} toControls={toControls} />
        <Box css={styles.divider} />
        <Box.Stack gap="$6">
          {Boolean(fromNetwork && toNetwork) && (
            <Box.Stack gap="$2">
              <Text color="intentsBase12">Network</Text>
              <motion.div animate={fromControls}>
                {isEthChain(fromNetwork) && (
                  <EthAccountConnection label="From" />
                )}
                {isFuelChain(fromNetwork) && (
                  <FuelAccountConnection label="From" />
                )}
              </motion.div>
              <motion.div animate={toControls}>
                {isEthChain(toNetwork) && <EthAccountConnection label="To" />}
                {isFuelChain(toNetwork) && <FuelAccountConnection label="To" />}
              </motion.div>
            </Box.Stack>
          )}
          <Box.Stack gap="$2">
            <Text color="intentsBase12">Asset amount</Text>
            <InputAmount
              isDisabled={!ethAddress && !fuelAddress}
              balance={assetBalance}
              asset={{
                name: asset?.symbol,
                imageUrl: asset?.icon || '',
                address: ethAssetAddress,
              }}
              value={assetAmount}
              onChange={(val) =>
                handlers.changeAssetAmount({ assetAmount: val || undefined })
              }
              onClickAsset={handlers.openAssetsDialog}
            />
          </Box.Stack>
          <BridgeButton />
          <Alert status="warning">
            <Alert.Description>
              {/* TODO: get it from contract constant to show exact time, instead of hardcoded "7 days" */}
              Any assets deposited to Fuel takes 7 days to withdraw back to
              Ethereum. Learn more about our architecture and security in
              our&nbsp;
              <Link href="https://docs.fuel.network/" isExternal>
                docs
              </Link>
            </Alert.Description>
          </Alert>
        </Box.Stack>
      </Card.Body>
    </Card>
  );
};

const styles = {
  cardBody: cssObj({
    p: '$7',
  }),
  divider: cssObj({
    h: '1px',
    bg: '$border',
    mt: '$1',
    mb: '$5',
  }),
};
