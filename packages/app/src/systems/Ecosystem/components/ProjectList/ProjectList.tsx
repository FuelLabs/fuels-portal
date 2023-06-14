import { Grid } from '@fuel-ui/react';

import { ProjectItem, type Project } from '../ProjectItem';

type ProjectListProps = {
  projects: Project[];
};

export const ProjectList = ({ projects }: ProjectListProps) => {
  return (
    <Grid
      gap="$8"
      templateColumns="repeat(2, 1fr)"
      templateRows="repeat(2, 1fr)"
    >
      {projects.map((project) => (
        <ProjectItem {...project} key={project.url} />
      ))}
    </Grid>
  );
};
