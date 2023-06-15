import { cssObj } from '@fuel-ui/css';
import { Grid } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { ProjectItem, type Project } from '../ProjectItem';

import { animations } from '~/systems/Core';

const MotionGrid = motion(Grid);

type ProjectListProps = {
  projects: Project[];
};

export const ProjectList = ({ projects }: ProjectListProps) => {
  return (
    <MotionGrid
      gap="$8"
      templateColumns="repeat(2, 1fr)"
      templateRows="repeat(2, 1fr)"
      css={styles.grid}
      {...animations.slideInBottom({
        transition: { staggerChildren: 0.5, type: 'spring' },
      })}
    >
      <AnimatePresence initial={false} mode="sync">
        {projects?.map((project) => (
          <ProjectItem {...project} key={project.url} />
        ))}
      </AnimatePresence>
    </MotionGrid>
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
