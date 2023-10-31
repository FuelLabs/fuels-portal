// components/ProjectDetailPanel.tsx

import { Box, Image, Link } from '@fuel-ui/react';
import type { FC } from 'react';

import type { Project } from '../../types';

type ProjectDetailPanelProps = {
  project: Project;
  onClose: () => void;
};

const ProjectDetailPanel: FC<ProjectDetailPanelProps> = ({
  project,
  onClose,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100%',
        width: '300px',
        backgroundColor: '#fff',
        zIndex: 9999,
      }}
    >
      <button onClick={onClose}>Close</button>
      <Image src={project.image || 'default_image_url'} alt="Profile" />
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <Box>
        {project.twitter && <Link href={project.twitter}>Twitter</Link>}
        {project.github && <Link href={project.github}>GitHub</Link>}
        {project.discord && <Link href={project.discord}>Discord</Link>}
      </Box>
      {/* Add more details here */}
    </div>
  );
};

export default ProjectDetailPanel;
