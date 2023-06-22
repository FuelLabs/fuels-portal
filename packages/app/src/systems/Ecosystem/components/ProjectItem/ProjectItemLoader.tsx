import { cssObj } from '@fuel-ui/css';
import { Card, ContentLoader, type ContentLoaderProps } from '@fuel-ui/react';

export const ProjectItemLoader = (props: ContentLoaderProps) => {
  return (
    <Card>
      <ContentLoader
        style={styles.loader}
        height={160}
        viewBox="0 0 496 180"
        {...props}
      >
        <rect x="20" y="30" width="40" height="40" rx="4" />
        <rect x="80" y="30" width="120" height="20" rx="4" />
        <rect x="80" y="80" width="400" height="14" rx="4" />
        <rect x="460" y="30" width="20" height="20" rx="4" />
        <rect x="80" y="120" width="80" height="20" rx="4" />
        <rect x="400" y="120" width="80" height="20" rx="4" />
      </ContentLoader>
    </Card>
  );
};

const styles = {
  loader: cssObj({
    width: '100%',
    maxWidth: '496px',
  }),
};
