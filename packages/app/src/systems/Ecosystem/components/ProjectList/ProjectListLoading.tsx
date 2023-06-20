import { cssObj } from '@fuel-ui/css';
import { Grid } from '@fuel-ui/react';

import { ProjectItem } from '../ProjectItem';

type ProjectListLoadingProps = {
  items?: number;
};

export const ProjectListLoading = ({ items = 8 }: ProjectListLoadingProps) => {
  return (
    <Grid
      gap="$8"
      templateColumns="repeat(2, 1fr)"
      templateRows="repeat(2, 1fr)"
      css={styles.grid}
    >
      {Array.from({ length: items }).map((_, idx) => (
        <ProjectItem.Loader key={idx} />
      ))}
    </Grid>
  );
};

const styles = {
  grid: cssObj({
    /// show only 1 column on mobile
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  }),
};
