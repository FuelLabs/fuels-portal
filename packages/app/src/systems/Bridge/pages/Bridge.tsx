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
        <Card.Header justify="center" css={styles.header}>
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
        </Card.Header>
        <Card.Body>
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
  header: cssObj({
    px: '$8',
    pt: '$8',
    pb: '$4',
  }),
  tabList: cssObj({
    borderBottom: 'none',
    padding: '$1',
    backgroundColor: '$gray4',
    borderRadius: '$md',
    width: '344px',
    height: '40px',
    alignItems: 'center',

    '& > :after': { content: 'none' },

    'button.bridge--navItemActive': {
      backgroundColor: '$whiteA12',
    },
  }),
  tabTrigger: cssObj({
    height: '36px',
    borderRadius: '$md',
    color: '$blackA12',
    fontSize: '$xs',
    flexGrow: '1',
    '&[data-state="active"]': {
      backgroundColor: '$whiteA12',
      color: '$blackA12',
      borderBottomColor: 'transparent',
    },
  }),
};
