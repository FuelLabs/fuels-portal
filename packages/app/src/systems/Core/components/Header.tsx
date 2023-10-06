import { cssObj } from '@fuel-ui/css';
import { Nav } from '@fuel-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IS_PREVIEW } from '~/config';
import { Pages } from '~/types';

import { removeTrailingSlash } from '../utils';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLinkActive = (url: string) => {
    return removeTrailingSlash(location.pathname) === removeTrailingSlash(url);
  };

  return (
    <Nav>
      <Nav.Desktop>
        <Nav.Logo />
        <Nav.Spacer />
        {IS_PREVIEW && (
          <Nav.Menu>
            <Nav.MenuItem
              as="div"
              css={styles.menuItem}
              onClick={() => navigate(Pages.bridge)}
              isActive={isLinkActive(Pages.bridge)}
            >
              Bridge
            </Nav.MenuItem>
            <Nav.MenuItem
              as="div"
              css={styles.menuItem}
              onClick={() => navigate(Pages.ecosystem)}
              isActive={isLinkActive(Pages.ecosystem)}
            >
              Ecosystem
            </Nav.MenuItem>
          </Nav.Menu>
        )}
        <Nav.ThemeToggle />
      </Nav.Desktop>
      <Nav.Mobile css={styles.menu} data-preview={IS_PREVIEW}>
        <Nav.MobileContent>
          <Nav.Logo />
          <Nav.ThemeToggle />
        </Nav.MobileContent>
        {IS_PREVIEW && (
          <Nav.Menu>
            <Nav.MenuItem
              as="div"
              css={styles.menuItem}
              onClick={() => navigate(Pages.bridge)}
              isActive={isLinkActive(Pages.bridge)}
            >
              Bridge
            </Nav.MenuItem>
            <Nav.MenuItem
              as="div"
              css={styles.menuItem}
              onClick={() => navigate(Pages.ecosystem)}
              isActive={isLinkActive(Pages.ecosystem)}
            >
              Ecosystem
            </Nav.MenuItem>
          </Nav.Menu>
        )}
      </Nav.Mobile>
    </Nav>
  );
}

const styles = {
  menuItem: cssObj({
    cursor: 'pointer',
  }),
  menu: cssObj({
    '&[data-preview="false"] [aria-label="Toggle Menu"]': {
      display: 'none',
    },
  }),
};
