// components/ProjectDetailPanel.tsx

import { Box, Image, Link } from '@fuel-ui/react';
import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';

import type { Project } from '../../types';

type ProjectDetailPanelProps = {
  project: Project;
  onClose: () => void;
};

const ProjectDetailPanel: FC<ProjectDetailPanelProps> = ({
  project,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    // Attach the click event handler
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef} // Added ref here
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100%',
        width: '300px',
        backgroundColor: '#fff',
        boxShadow: '-2px 0px 5px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        overflowY: 'auto',
        zIndex: 1000, // adjust as needed
      }}
    >
      <button onClick={onClose} style={{ marginBottom: '20px' }}>
        Close
      </button>
      <Image
        src={project.image || 'default_image_url'}
        alt="Profile"
        style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }}
      />
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>{project.name}</h2>
      <p style={{ fontSize: '16px', marginBottom: '20px' }}>
        {project.description}
      </p>
      <Box style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        {project.twitter && <Link href={project.twitter}>Twitter</Link>}
        {project.github && <Link href={project.github}>GitHub</Link>}
        {project.discord && <Link href={project.discord}>Discord</Link>}
      </Box>
      {/* Add more details here */}
    </div>
  );
};

export default ProjectDetailPanel;
