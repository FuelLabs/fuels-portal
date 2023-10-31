import { Badge, Box, Link, Tag, TagCloseButton } from '@fuel-ui/react';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import type { Project } from '../../types';
import { ProjecImage } from '../ProjectImage';

type ProjectDetailPanelProps = {
  project: Project;
  onClose: () => void;
};

const ProjectDetailPanel: FC<ProjectDetailPanelProps> = ({
  project,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isPanelVisible, setPanelVisible] = useState(true);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setPanelVisible(false);
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      {isPanelVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(5px)',
            zIndex: 999,
            transition: 'backdropFilter 0.5s ease',
          }}
        ></div>
      )}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100%',
          width: '50%',
          backgroundColor: '#fff',
          boxShadow: '-2px 0px 5px rgba(0, 0, 0, 0.1)',
          padding: '30px',
          overflowY: 'auto',
          zIndex: 1000,
          transform: isPanelVisible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        }}
      >
        <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tag leftIconAriaLabel="close" variant="ghost" onClick={onClose}>
            Close
            <TagCloseButton />
          </Tag>
        </Box>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '90px',
            height: '90px',
            borderRadius: '12px',
            overflow: 'hidden',
            //marginBottom: '20px',
            border: '2px solid #000',
          }}
        >
          <ProjecImage
            name={project.name}
            image={project.image}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        </Box>

        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
          {project.name}
        </h2>
        <Box
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          {project.tags?.map((tag, index) => (
            <Badge
              key={index}
              variant="outlined"
              style={{
                fontSize: 'small',
                fontWeight: '500',
              }}
            >
              {tag}
            </Badge>
          ))}
        </Box>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          {project.description}
        </p>
        <Box style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
          {project.twitter && <Link href={project.twitter}>Twitter</Link>}
          {project.github && <Link href={project.github}>GitHub</Link>}
          {project.discord && <Link href={project.discord}>Discord</Link>}
        </Box>
      </div>
    </>
  );
};

export default ProjectDetailPanel;
