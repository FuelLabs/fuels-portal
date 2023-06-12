import { cssObj } from '@fuel-ui/css';
import { Box, FuelLogo, IconButton, ButtonLink, Link } from '@fuel-ui/react';
import { useLocation } from 'react-router-dom';

import { useTheme } from '~/systems/Settings';
import { Pages } from '~/types';

export function Header() {
  const location = useLocation();
  const { handlers } = useTheme();

  const getClassName = (url: string) => {
    return location.pathname === url ? 'header--navItemActive' : undefined;
  };

  return (
    <Box.Flex as="header" css={styles.root}>
      <Box.Flex gap="$4" css={styles.menu}>
        <Link href="/" className="logo">
          <FuelLogo size={24} />
        </Link>
        <ButtonLink
          href={Pages.developers}
          className={getClassName(Pages.developers)}
        >
          Developers
        </ButtonLink>
        <ButtonLink
          href={Pages.community}
          className={getClassName(Pages.community)}
        >
          Community
        </ButtonLink>
        <ButtonLink href={Pages.labs} className={getClassName(Pages.labs)}>
          Labs
        </ButtonLink>
      </Box.Flex>
      <Box.Flex gap="$4" css={styles.desktop}>
        <Box.Flex gap="$4" css={styles.menu}>
          <ButtonLink
            href={Pages.bridge}
            className={getClassName(Pages.bridge)}
          >
            Bridge
          </ButtonLink>
          <ButtonLink
            href={Pages.explorer}
            className={getClassName(Pages.explorer)}
          >
            Explorer
          </ButtonLink>
          <ButtonLink href={Pages.ecosystem} className={Pages.ecosystem}>
            Ecosystem
          </ButtonLink>
        </Box.Flex>
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
  );
}

const styles = {
  root: cssObj({
    backgroundColor: '$intentsBase1',
    borderBottom: '1px solid $intentsBase5',
    justifyContent: 'space-between',
    pl: '$14',
    zIndex: '$10',
    position: 'sticky',
    top: 0,
    background: '#0000000',
    gap: '$2',
    py: '$4',
    px: '$4',
    alignItems: 'center',
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
