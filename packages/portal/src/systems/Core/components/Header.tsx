import { cssObj } from '@fuel-ui/css';
import { Box, FuelLogo, IconButton, Link } from '@fuel-ui/react';

import { useTheme } from '~/systems/Settings';

export function Header() {
  const { handlers } = useTheme();

  return (
    <Box.Flex as="header" css={styles.root} align="center" justify="center">
      <Box.Flex css={styles.wrapper} align="center" justify="space-between">
        <Box.Flex gap="$4" css={styles.menu}>
          <Link href="https://fuel.network/" className="logo">
            <FuelLogo size={24} />
          </Link>
        </Box.Flex>
        <Box.Flex gap="$4" css={styles.desktop}>
          <Box.Flex gap="$1" css={styles.buttonContainer}>
            <IconButton
              icon="Moon"
              aria-label="Theme-Switch"
              iconSize={14}
              css={styles.themeButton}
              onPress={handlers.toggle}
            />
          </Box.Flex>
        </Box.Flex>
      </Box.Flex>
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    borderBottom: '1px solid $intentsBase5',
    background: '$bodyBg',
    pl: '$14',
    zIndex: '$10',
    position: 'sticky',
    top: 0,
    gap: '$2',
    py: '$4',
    px: '$4',
    '.logo': {
      display: 'inline-flex',
      color: '$intentsBase8',
    },

    '@md': {
      px: '$8',
    },

    '@xl': {
      py: '$4',
      px: '$8',
    },
  }),
  wrapper: cssObj({
    width: '$full',
    maxWidth: 1216,
  }),
  desktop: cssObj({
    alignItems: 'center',
    '@xl': {
      display: 'flex',
      alignItems: 'center',
    },
  }),
  buttonContainer: cssObj({
    height: '28px',
  }),
  themeButton: cssObj({
    height: '$7',
    background: '$intentsBase5',
    color: '$intentsBase10',
    borderRadius: '$md',
    fontSize: '$xs',
    width: '$6',
  }),
  menu: cssObj({
    a: {
      color: '$intentsBase10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$intentsPrimary10',
    },

    'a.header--navItemActive': {
      color: '$intentsPrimary10',
    },
  }),
};
