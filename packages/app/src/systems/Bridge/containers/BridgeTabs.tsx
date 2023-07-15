import { Tabs } from '@fuel-ui/react';
import type { AnimationControls } from 'framer-motion';

import { useBridge } from '../hooks';

type BridgeTabsProps = {
  fromControls: AnimationControls;
  toControls: AnimationControls;
};

export const BridgeTabs = ({ fromControls, toControls }: BridgeTabsProps) => {
  const { handlers, isWithdraw } = useBridge();

  const moveVertically = async (
    control: AnimationControls,
    factor: number = 15
  ) => {
    control.set({ opacity: 0.4, y: factor });
    await control.start({ opacity: 1, y: 0, transition: { duration: 0.3 } });
  };
  const invertFromTo = async () => {
    moveVertically(fromControls, 80);
    await moveVertically(toControls, -80);
  };

  return (
    <Tabs defaultValue={isWithdraw ? 'withdraw' : 'deposit'} variant="subtle">
      <Tabs.List aria-label="Manage deposits">
        <Tabs.Trigger
          value="deposit"
          onClick={() => {
            if (isWithdraw) {
              invertFromTo();
              handlers.goToDeposit();
            }
          }}
        >
          Deposit to Fuel
        </Tabs.Trigger>
        <Tabs.Trigger
          value="withdraw"
          onClick={() => {
            if (!isWithdraw) {
              invertFromTo();
              handlers.goToWithdraw();
            }
          }}
        >
          Withdraw from Fuel
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs>
  );
};
