import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet';

import { Header } from './Header';

import { META_DESC, META_OGIMG } from '~/constants';

type LayoutProps = {
  title?: string;
  children: ReactNode;
};

export function Layout({ title, children }: LayoutProps) {
  const titleText = title || '';
  return (
    <>
      <Helmet>
        <title>{titleText}</title>
        <meta name="description" content={META_DESC} key="desc" />
        <meta property="og:title" content={titleText} />
        <meta property="og:description" content={META_DESC} />
        <meta property="og:image" content={META_OGIMG} />
      </Helmet>
      <Box css={styles.root}>
        <Header />
        {children}
      </Box>
    </>
  );
}

const styles = {
  root: cssObj({
    maxW: '100vw',
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '80px auto',

    '@xl': {
      gridTemplateColumns: '0.75fr 2.5fr 0.75fr',
      gridTemplateRows: '80px auto',
      gridColumnGap: '$14',
    },
  }),
};
