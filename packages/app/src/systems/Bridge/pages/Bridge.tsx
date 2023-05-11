import { cssObj } from '@fuel-ui/css';
import { Card, Tabs } from '@fuel-ui/react';
import { useLocation } from 'react-router-dom';

import { BridgeEthToFuel } from './BridgeEthToFuel';

import { Pages } from '~/types';

export const Bridge = () => {
  // TODO I think we can pass this in as a prop in the future
  const location = useLocation();

  const getClassName = (url: string) => {
    return location.pathname === url ? 'bridge--navItemActive' : undefined;
  };

  return (
    <Tabs defaultValue="deposit">
      <Card>
        <Card.Body>
          <Tabs.List aria-label="Manage deposits" css={styles.tabList}>
            <Tabs.Trigger
              value="deposit"
              className={getClassName(Pages.deposit)}
              css={styles.tabTrigger}
            >
              Deposit to Fuel
            </Tabs.Trigger>
            <Tabs.Trigger
              value="withdraw"
              className={getClassName(Pages.withdraw)}
              css={styles.tabTrigger}
            >
              Withdraw from Fuel
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="deposit">
            <BridgeEthToFuel />
          </Tabs.Content>
          <Tabs.Content value="withdraw"></Tabs.Content>
        </Card.Body>
      </Card>
    </Tabs>
  );
};

const styles = {
  tabList: cssObj({
    borderBottom: 'none',
    padding: '$1',
    backgroundColor: '$gray4',
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
