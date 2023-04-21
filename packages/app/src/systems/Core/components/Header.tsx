import { cssObj } from '@fuel-ui/css';
import {
  Button,
  Flex,
  FuelLogo,
  IconButton,
  ButtonLink,
  Link,
} from '@fuel-ui/react';
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
    <Flex as="header" css={styles.root}>
      <Flex gap="$4" css={styles.menu}>
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
      </Flex>
      <Flex gap="$4" css={styles.desktop}>
        <Flex gap="$4" css={styles.menu}>
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
        </Flex>
        <Flex gap="$1" css={styles.buttonContainer}>
          <IconButton
            icon="Moon"
            aria-label="Theme-Switch"
            iconSize={14}
            css={{ ...styles.connectButton, ...styles.iconButton }}
            onPress={handlers.toggleTheme}
          />
          <Button css={styles.connectButton}>Connect your Wallet</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

const styles = {
  root: cssObj({
    borderBottom: '1px solid $gray3',
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
    '.logo': {
      display: 'inline-flex',
      color: '$gray9',
    },

    '@md': {
      px: '$8',
    },

    '@xl': {
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
    alignItems: 'center',
    '@xl': {
      display: 'flex',
      alignItems: 'center',
    },
  }),
  buttonContainer: cssObj({
    height: '28px',
  }),
  iconButton: cssObj({
    width: '28px',
  }),
  connectButton: cssObj({
    height: 'inherit',
    background: '$gray2',
    color: '$gray11',
    borderRadius: '$md',
    fontSize: '$xs',
  }),
  menu: cssObj({
    a: {
      color: '$gray10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$accent8',
    },

    'a.header--navItemActive': {
      color: '$accent8',
    },
  }),
};
