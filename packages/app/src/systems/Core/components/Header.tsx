import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  Flex,
  FuelLogo,
  IconButton,
  ButtonLink,
  Text,
  Link,
} from '@fuel-ui/react';
import { useLocation } from 'react-router-dom';

import { Pages } from '~/types';

export function Header() {
  const location = useLocation();

  return (
    <Flex as="header" css={styles.root}>
      <Flex>
        <Flex>
          <Link href="/" className="logo">
            <FuelLogo size={35} />
          </Link>
        </Flex>
        <Flex css={styles.fuelText}>
          <Text fontSize="5xl" color="whiteA12">
            FUEL
          </Text>
        </Flex>
        <Flex align="center" css={styles.portalText}>
          <Text color="whiteA12" fontSize="2xl">
            Portal
          </Text>
        </Flex>
      </Flex>
      <Flex css={styles.menu}>
        <ButtonLink
          href={Pages.home}
          className={
            location.pathname === Pages.home
              ? 'header--navItemActive'
              : undefined
          }
        >
          Home
        </ButtonLink>
        <ButtonLink
          href={Pages.bridge}
          className={
            location.pathname === Pages.bridge
              ? 'header--navItemActive'
              : undefined
          }
        >
          Bridge
        </ButtonLink>
      </Flex>
      <Flex gap={15} css={styles.desktop}>
        <Box />
        <Box css={styles.connectButton}>
          <Button>Connect your Wallet</Button>
        </Box>
        <IconButton
          aria-label="Settings"
          icon="Gear"
          variant="link"
          size="lg"
        />
      </Flex>
    </Flex>
  );
}

const styles = {
  root: cssObj({
    justifyContent: 'space-between',
    paddingLeft: '54px',
    zIndex: '$10',
    position: 'sticky',
    top: 0,
    background: '#0000000',
    gap: '$2',
    py: '$4',
    px: '$4',
    alignItems: 'center',
    gridColumn: '1 / 4',

    '.logo': {
      display: 'inline-flex',
      color: '$gray9',
    },

    '@md': {
      px: '$8',
    },

    '@xl': {
      position: 'relative',
      py: '$4',
      px: '$8',
    },
  }),
  fuelText: cssObj({
    paddingLeft: '9px',
  }),
  portalText: cssObj({
    paddingLeft: '6px',
  }),
  desktop: cssObj({
    display: 'none',

    '@xl': {
      display: 'flex',
      alignItems: 'center',
    },
  }),
  connectButton: cssObj({
    ml: '$8',
  }),
  menu: cssObj({
    gap: '$6',

    a: {
      color: '$gray10',
      transition: 'all 0.3s',
    },

    'a:visited': {
      color: '$gray10',
    },

    'a.active, a:hover': {
      color: '$whiteA12',
    },

    'a.header--navItemActive': {
      color: '$whiteA12',
    },
  }),
};
