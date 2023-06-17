import { cssObj } from '@fuel-ui/css';
import { Text, Box, ButtonLink } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { Layout } from '~/systems/Core';
import { Pages } from '~/types';

type BridgeHomeProps = {
  children: ReactNode;
};

export const BridgeHome = ({ children }: BridgeHomeProps) => {
  const location = useLocation();

  const getClassName = (url: string) => {
    console.log('location: ', location.pathname);
    console.log(`url`, url);

    const temp =
      location.pathname === url ? 'header--navItemActive' : undefined;
    console.log(`temp`, temp);
    console.log(`location.pathname === url`, location.pathname === url);
    return temp;
  };

  return (
    <Layout>
      <Layout.Content>
        <Text fontSize="2xl" css={styles.heading}>
          Fuel Native Bridge
        </Text>
        <Box.Flex gap="$2" css={styles.buttonLinks}>
          <ButtonLink
            href={Pages.bridge}
            className={getClassName(Pages.bridge)}
          >
            Bridge
          </ButtonLink>
          <ButtonLink
            href={Pages.transactions}
            className={getClassName(Pages.transactions)}
          >
            Transactions
          </ButtonLink>
        </Box.Flex>
        {children}
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
    mb: '$3',
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
      textDecoration: 'none',
    },

    'a.header--navItemActive': {
      color: '$intentsBase12',
      borderBottom: '2px solid $intentsPrimary9 !important',
    },
  }),
};
