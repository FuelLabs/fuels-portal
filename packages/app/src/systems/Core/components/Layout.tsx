import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { FC, ReactNode } from 'react';
import { Helmet } from 'react-helmet';

import { coreStyles } from '../styles';

import { Header } from './Header';

import { META_DESC, META_OGIMG } from '~/constants';
import { OverlayDialog } from '~/systems/Overlay';

type ContentProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any;
  children: ReactNode;
  css?: ThemeUtilsCSS;
};

const Content = ({ as, children, css }: ContentProps) => {
  return (
    <Box
      as={as}
      css={{ ...styles.content, ...css }}
      className="layout__content"
    >
      {children}
    </Box>
  );
};

type LayoutComponent = FC<LayoutProps> & {
  Content: typeof Content;
};

type LayoutProps = {
  title?: string;
  children: ReactNode;
};

export const Layout: LayoutComponent = ({ title, children }: LayoutProps) => {
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
      <Box as="main" css={styles.root}>
        <Header />
        <OverlayDialog />
        {children}
      </Box>
    </>
  );
};

Layout.Content = Content;

const styles = {
  root: cssObj({
    maxW: '100vw',
    height: '100vh',
  }),
  content: cssObj({
    ...coreStyles.scrollable(),
    padding: '$4',
    maxWidth: 420,
    margin: '0 auto',
  }),
};
