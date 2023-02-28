import { cssObj } from '@fuel-ui/css';
import { Box, Button, Flex, FuelLogo, Link } from '@fuel-ui/react';

export function Header() {
  return (
    <Flex as="header" css={styles.root}>
      <Box css={{ flex: 1 }}>
        <Link href="/" className="logo">
          <FuelLogo size={40} />
        </Link>
      </Box>
      <Box css={styles.desktop}>
        <Flex css={styles.menu}>
          <Link href="/docs/install">One</Link>
          <Link href="/docs/install">Two</Link>
        </Flex>
        <Box />
        <Box css={{ ml: '$8' }}>
          <Button>Connect your Wallet</Button>
        </Box>
      </Box>
    </Flex>
  );
}

const styles = {
  root: cssObj({
    zIndex: '$10',
    position: 'sticky',
    top: 0,
    background: '#090a0a',
    gap: '$2',
    py: '$4',
    px: '$4',
    alignItems: 'center',
    borderBottom: '1px solid $gray2',
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
  desktop: cssObj({
    display: 'none',

    '@xl': {
      display: 'flex',
      alignItems: 'center',
    },
  }),
  menu: cssObj({
    gap: '$6',

    a: {
      color: '$gray10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$accent11',
    },
  }),
};
