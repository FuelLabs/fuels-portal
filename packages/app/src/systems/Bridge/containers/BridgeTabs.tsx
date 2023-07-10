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
    await moveHorizontally(-50);
  };
  const leftToRight = async () => {
    await moveHorizontally(50);
  };

  return (
    <Tabs defaultValue={isWithdraw ? 'withdraw' : 'deposit'} variant="subtle">
      <Tabs.List aria-label="Manage deposits">
        <Tabs.Trigger
          value="deposit"
          onClick={() => {
            rightToLeft();
            handlers.goToDeposit();
          }}
        >
          Deposit to Fuel
        </Tabs.Trigger>
        <Tabs.Trigger
          value="withdraw"
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
