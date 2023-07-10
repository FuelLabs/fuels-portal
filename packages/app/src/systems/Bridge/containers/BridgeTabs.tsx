import { cssObj } from '@fuel-ui/css';
import { Tabs } from '@fuel-ui/react';
import type { AnimationControls } from 'framer-motion';

import { useBridge } from '../hooks';

type BridgeTabsProps = {
  controls: AnimationControls;
};

export const BridgeTabs = ({ controls }: BridgeTabsProps) => {
  const { handlers, isWithdraw } = useBridge();

  const moveHorizontally = async (factor: number = 15) => {
    controls.set({ opacity: 0.4, x: factor });
    await controls.start({ opacity: 1, x: 0, transition: { duration: 0.3 } });
  };
  const rightToLeft = async () => {
    await moveHorizontally(50);
  };
  const leftToRight = async () => {
    await moveHorizontally(-50);
  };

  return (
    <Tabs defaultValue={isWithdraw ? 'withdraw' : 'deposit'}>
      <Tabs.List aria-label="Manage deposits" css={styles.tabList}>
        <Tabs.Trigger
          value="deposit"
          css={styles.tabTrigger}
          onClick={() => {
            rightToLeft();
            handlers.goToDeposit();
          }}
        >
          Deposit to Fuel
        </Tabs.Trigger>
        <Tabs.Trigger
          value="withdraw"
          css={styles.tabTrigger}
          onClick={() => {
            leftToRight();
            handlers.goToWithdraw();
          }}
        >
          Withdraw from Fuel
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs>
  );
};

const styles = {
  tabList: cssObj({
    borderBottom: 'none',
    padding: '$1',
    backgroundColor: '$intentsBase4',
    borderRadius: '$md',
    alignItems: 'center',

    '& > :after': { content: 'none' },

    'button.bridge--navItemActive': {
      backgroundColor: '$intentsBase12',
    },
  }),
  tabTrigger: cssObj({
    borderRadius: '$md',
    color: '$intentsBase11',
    fontSize: '$sm',
    flex: '1 0',
    margin: '0 !important',
    '&[data-state="active"]': {
      color: '$intentsBase12',
      backgroundColor: '$intentsBase1',
      borderBottomColor: 'transparent',
    },
    '&:hover': {
      color: '$intentsBase12',
    },
  }),
};
