import { cssObj } from '@fuel-ui/css';
import { Card, Box, Text, InputAmount, Alert, Link } from '@fuel-ui/react';
import { motion, useAnimationControls } from 'framer-motion';

import { BridgeButton, BridgeTabs } from '../containers';
import { useBridge } from '../hooks';

import {
  EthAccountConnection,
  FuelAccountConnection,
  isEthChain,
  isFuelChain,
} from '~/systems/Chains';

export const Bridge = () => {
  const { fromNetwork, toNetwork, assetAmount, assetBalance, asset, handlers } =
    useBridge();

  const fromControls = useAnimationControls();
  const toControls = useAnimationControls();

  if (!fromNetwork || !toNetwork) return null;

  return (
    <Card variant="outlined">
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
            <Text color="intentsBase12">Asset</Text>
            <Box css={styles.amountInput}>
              <InputAmount
                balance={assetBalance}
                asset={{
                  name: asset?.symbol,
                  imageUrl: asset?.image,
                }}
                value={assetAmount}
                onChange={(val) =>
                  handlers.changeAssetAmount({ assetAmount: val || undefined })
                }
                // TODO: enable this when we include erc-20 deposit
                // onClickAsset={handlers.openAssetsDialog}
              />
            </Box>
          </Box.Stack>
          <BridgeButton />
          <Alert status="warning">
            <Alert.Description>
              Any assets deposited to Fuel takes 7 days to withdraw back to
              Ethereum. Learn more about our architecture and security in
              our&nbsp;
              <Link href="https://fuel.sh/" isExternal>
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
  amountInput: cssObj({
    '& > div': {
      px: '$3',
      py: '$2',
      backgroundColor: 'transparent',
    },
    '& button': {
      borderColor: '$border',
    },
  }),
};
