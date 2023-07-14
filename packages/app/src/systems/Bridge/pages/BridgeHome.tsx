import { cssObj } from '@fuel-ui/css';
import { ButtonLink, Tabs, Heading } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { Layout, removeTrailingSlash } from '~/systems/Core';
import { Pages } from '~/types';

type BridgeHomeProps = {
  children: ReactNode;
};

export const BridgeHome = ({ children }: BridgeHomeProps) => {
  const location = useLocation();

  const isCurrentPage = (pageUrl: string) =>
    removeTrailingSlash(location.pathname) === removeTrailingSlash(pageUrl);

  const currentTab = isCurrentPage(Pages.bridge) ? 'bridge' : 'transactions';

  return (
    <Layout>
      <Layout.Content css={styles.content}>
        <Heading as="h2" css={styles.heading}>
          Fuel Native Bridge
        </Heading>
        <Tabs defaultValue={currentTab}>
          <Tabs.List>
            <ButtonLink href={Pages.bridge} css={styles.buttonLink}>
              <Tabs.Trigger value="bridge">Bridge</Tabs.Trigger>
            </ButtonLink>
            <ButtonLink href={Pages.transactions} css={styles.buttonLink}>
              <Tabs.Trigger value="transactions">Transactions</Tabs.Trigger>
            </ButtonLink>
          </Tabs.List>
          {children}
        </Tabs>
      </Layout.Content>
    </Layout>
  );
};

const styles = {
  content: cssObj({
    maxWidth: '$sm',
  }),
  heading: cssObj({
    mt: 0,
    mb: '$4',
  }),
  buttonLink: cssObj({
    '&:hover': {
      textDecoration: 'none',
    },
  }),
};
