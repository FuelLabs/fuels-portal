import { cssObj } from '@fuel-ui/css';
import {
  Card,
  Box,
  Text,
  InputAmount,
  Alert,
  Link,
  Button,
} from '@fuel-ui/react';
import { motion, useAnimate, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';

import { BridgeButton, BridgeTabs } from '../containers';
import { useBridge } from '../hooks';

import {
  ETH_SYMBOL,
  EthAccountConnection,
  ethLogoSrc,
  FuelAccountConnection,
  isEthChain,
  isFuelChain,
} from '~/systems/Chains';
import { animations, coreStyles } from '~/systems/Core';

// const MotionCard = motion(Card);
// const MotionBox = motion(Box);
/// const MotionStack = motion(Box.Stack);

export const Bridge = () => {
  const { fromNetwork, toNetwork, assetAmount, assetBalance, handlers } =
    useBridge();

  const controls = useAnimationControls();

  // const [isDepositPage, setIsDepositPage] = useState(true);

  // const triggerAnimation = async () => {
  //   controls.set({ opacity: 0.4, x: 30 });
  //   await controls.start({ opacity: 1, x: 0 });
  // };

  if (!fromNetwork || !toNetwork) return null;

  return (
    <Card css={coreStyles.card}>
      <Card.Body>
        <BridgeTabs controls={controls} />
        <motion.div animate={controls}>
          <Box.Stack gap="$6">
            {Boolean(fromNetwork && toNetwork) && (
              <Box.Stack gap="$2">
                <Text fontSize="sm" css={styles.sectionHeader}>
                  Network
                </Text>
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
              <Text fontSize="sm" css={styles.sectionHeader}>
                Asset
              </Text>
              <Box css={styles.amountInput}>
                <InputAmount
                  balance={assetBalance}
                  asset={{
                    name: ETH_SYMBOL,
                    imageUrl: ethLogoSrc,
                  }}
                  assetTooltip="Fuel Bridge only supports ETH for now. Other assets will be added soon."
                  value={assetAmount}
                  onChange={(val) =>
                    handlers.changeAssetAmount({ assetAmount: val })
                  }
                />
              </Box>
            </Box.Stack>
            <BridgeButton />
            {/* <Button onPress={triggerAnimation}>Trigger animatiuon</Button> */}
            {isFuelChain(toNetwork) && (
              <Alert status="warning">
                <Alert.Description>
                  <Text fontSize="sm">
                    Any assets deposited to Fuel takes 7 days to withdraw back
                    to Ethereum. Learn more about our architecture and security
                    in our&nbsp;
                    <Link href="https://fuel.sh/" isExternal>
                      docs
                    </Link>
                  </Text>
                </Alert.Description>
              </Alert>
            )}
          </Box.Stack>
        </motion.div>
      </Card.Body>
    </Card>
  );
};

const styles = {
  sectionHeader: cssObj({
    fontWeight: '$semibold',
    color: '$intentsBase12',
  }),
  amountInput: cssObj({
    '& > div': {
      px: '$3',
      py: '$2',
    },
  }),
};
