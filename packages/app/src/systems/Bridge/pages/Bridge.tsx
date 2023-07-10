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

  const controls = useAnimationControls();

  if (!fromNetwork || !toNetwork) return null;

  return (
    <Card>
      <Card.Body>
        <BridgeTabs controls={controls} />
        <motion.div animate={controls}>
          <Box.Stack gap="$6">
            {Boolean(fromNetwork && toNetwork) && (
              <Box.Stack gap="$2">
                <Text color="intentsBase12">Network</Text>
                {isEthChain(fromNetwork) && (
                  <EthAccountConnection label="From" />
                )}
                {isFuelChain(fromNetwork) && (
                  <FuelAccountConnection label="From" />
                )}
                {isEthChain(toNetwork) && <EthAccountConnection label="To" />}
                {isFuelChain(toNetwork) && <FuelAccountConnection label="To" />}
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
                    handlers.changeAssetAmount({ assetAmount: val })
                  }
                  onClickAsset={handlers.openAssetsDialog}
                />
              </Box>
            </Box.Stack>
            <BridgeButton />
            <Alert status="warning">
              <Alert.Description>
                <Text fontSize="sm">
                  Any assets deposited to Fuel takes 7 days to withdraw back to
                  Ethereum. Learn more about our architecture and security in
                  our&nbsp;
                  <Link href="https://fuel.sh/" isExternal>
                    docs
                  </Link>
                </Text>
              </Alert.Description>
            </Alert>
          </Box.Stack>
        </motion.div>
      </Card.Body>
    </Card>
  );
};

const styles = {
  amountInput: cssObj({
    '& > div': {
      px: '$3',
      py: '$2',
    },
  }),
};
