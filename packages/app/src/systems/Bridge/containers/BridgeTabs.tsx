import { cssObj } from '@fuel-ui/css';
import { Tabs } from '@fuel-ui/react';

import { useBridge } from '../hooks';

export const BridgeTabs = () => {
  const { handlers, isWithdraw } = useBridge();

  return (
    <Tabs defaultValue={isWithdraw ? 'withdraw' : 'deposit'}>
      <Tabs.List aria-label="Manage deposits" css={styles.tabList}>
        <Tabs.Trigger
          value="deposit"
          css={styles.tabTrigger}
          onClick={handlers.goToDeposit}
        >
          Deposit to Fuel
        </Tabs.Trigger>
        <Tabs.Trigger
          value="withdraw"
          css={styles.tabTrigger}
          onClick={handlers.goToWithdraw}
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
