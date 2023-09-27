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
              onClick={() => navigate(Pages.bridge)}
              isActive={isLinkActive(Pages.bridge)}
            >
              Bridge
            </Nav.MenuItem>
            <Nav.MenuItem
              onClick={() => navigate(Pages.ecosystem)}
              isActive={isLinkActive(Pages.ecosystem)}
            >
              Ecosystem
            </Nav.MenuItem>
          </Nav.Menu>
        )}
        <Nav.ThemeToggle />
      </Nav.Desktop>
      <Nav.Mobile>
        <Nav.MobileContent>
          <Nav.Logo />
          <Nav.ThemeToggle />
        </Nav.MobileContent>
        {IS_PREVIEW && (
          <Nav.Menu>
            <Nav.MenuItem
              href={Pages.bridge}
              isActive={isLinkActive(Pages.bridge)}
            >
              Bridge
            </Nav.MenuItem>
            <Nav.MenuItem
              href={Pages.ecosystem}
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
