import { cssObj } from '@fuel-ui/css';
import { Text, Box, ButtonLink } from '@fuel-ui/react';
import { useLocation } from 'react-router-dom';

import { Bridge } from './Bridge';

import { Layout } from '~/systems/Core';
import { Pages } from '~/types';

export const BridgeHome = () => {
  const location = useLocation();

  const getClassName = (url: string) => {
    return location.pathname === url ? 'header--navItemActive' : undefined;
  };

  return (
    <Layout>
      <Layout.Content>
        <Text fontSize="2xl" css={styles.heading}>
          Fuel Native Bridge
        </Text>
        <Box.Flex gap="$2" css={styles.buttonLinks}>
          <ButtonLink className={getClassName(Pages.bridge)}>Bridge</ButtonLink>
          <ButtonLink className={getClassName(Pages.transactions)}>
            Transactions
          </ButtonLink>
        </Box.Flex>
        <Bridge />
      </Layout.Content>
    </Layout>
  );
};

const styles = {
  heading: cssObj({
    mt: '$16',
    color: '$intentsBase12',
  }),
  buttonLinks: cssObj({
    a: {
      my: '$4',
      px: '0',
      color: '$intentsBase10',
      transition: 'all 0.3s',
      borderRadius: 0,
      borderBottom: '2px solid transparent !important',

      '&:not([aria-disabled=true]):active, &:not([aria-disabled=true])[aria-pressed=true]':
        {
          transform: 'none',
        },
      '&:focus-visible': {
        outline: 'none !important',
        outlineOffset: 'unset !important',
        borderRadius: 0,
      },
    },

    'a.active, a:hover': {
      color: '$accent8',
    },

    'a.header--navItemActive': {
      color: '$intentsBase12',
      borderBottom: '2px solid $green9 !important',
    },
  }),
};
