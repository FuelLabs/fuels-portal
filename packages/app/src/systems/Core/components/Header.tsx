import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  Flex,
  FuelLogo,
  IconButton,
  Link,
  Text,
} from '@fuel-ui/react';

import { Pages } from '~/types';

export function Header() {
  return (
    <Flex as="header" css={{ ...styles.root, justifyContent: 'space-between' }}>
      <Flex>
        <Flex>
          <Link href="/" className="logo">
            <FuelLogo size={35} />
          </Link>
        </Flex>
        <Flex css={{ paddingLeft: '9px' }}>
          <Text fontSize="5xl" color="whiteA12">
            FUEL
          </Text>
        </Flex>
        <Flex align="center" css={{ paddingLeft: '6px' }}>
          <Text color="whiteA12" css={{ fontSize: '$2xl' }}>
            Portal
          </Text>
        </Flex>
      </Flex>
      <Flex css={styles.menu}>
        <Link href={Pages.bridge}>Bridge</Link>
      </Flex>
      <Flex gap={15} css={{ ...styles.desktop }}>
        <Box />
        <Box css={{ ml: '$8' }}>
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
