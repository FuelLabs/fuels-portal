import { cssObj } from '@fuel-ui/css';
import { Grid } from '@fuel-ui/react';

import { type Project } from '../../types';
import { ProjectItem } from '../ProjectItem';

import { ProjectListEmpty } from './ProjectListEmpty';
import { ProjectListLoading } from './ProjectListLoading';

type ProjectListProps = {
  projects: Project[];
  isLoading?: boolean;
  emptyText?: string;
};

export const ProjectList = ({
  projects,
  isLoading,
  emptyText,
}: ProjectListProps) => {
  if (isLoading) return <ProjectList.Loading />;
  const isEmpty = projects.length === 0;

  if (isEmpty) return <ProjectList.Empty text={emptyText} />;
  return (
    <Grid
      gap="$8"
      templateColumns="repeat(2, 1fr)"
      templateRows="repeat(2, 1fr)"
      css={styles.grid}
    >
      {projects.map((project) => (
        <ProjectItem {...project} key={project.url} />
      ))}
    </Grid>
  );
};

const styles = {
  grid: cssObj({
    alignItems: 'flex-start',
    /// show only 1 column on mobile
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  }),
};

ProjectList.Loading = ProjectListLoading;
ProjectList.Empty = ProjectListEmpty;
