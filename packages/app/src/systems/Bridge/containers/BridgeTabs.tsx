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
    backgroundColor: '$gray4',
    borderRadius: '$md',
    width: '344px',
    height: '40px',
    alignItems: 'center',

    '& > :after': { content: 'none' },
  }),
  tabTrigger: cssObj({
    height: '36px',
    borderRadius: '$md',
    color: '$blackA12',
    fontSize: '$xs',
    flexGrow: '1',
    cursor: 'pointer',
    '&[data-state="active"]': {
      backgroundColor: '$whiteA12',
      color: '$blackA12',
      borderBottomColor: 'transparent',
    },
  }),
};
