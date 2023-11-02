import { Badge, Box, Button, Link, Tag, TagCloseButton } from '@fuel-ui/react';
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
          flexDirection: 'column',
          alignItems: 'start',
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100%',
          width: '50%',
          backgroundColor: '#000000',
          boxShadow: '-15px 0px 15px rgba(0, 245, 140, 0.4)',
          padding: '30px',
          overflowY: 'auto',
          zIndex: 1000,
          transform: isPanelVisible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        }}
      >
        <div
          style={{
            background: '#010101',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '200px',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            //boxShadow: '0px 0px 75px rgba(0, 245, 140, 0.5)',
            borderBottom: '1px solid #00F58C',
          }}
        >
          <Box
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              position: 'fixed',
              top: 15,
              right: 15,
              zIndex: 4,
            }}
          >
            <Tag
              rightIconAriaLabel="close"
              variant="outlined"
              onClick={onClose}
            >
              Close
              <TagCloseButton />
            </Tag>
          </Box>
        </div>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '110px',
            height: '110px',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '20px',
            position: 'relative',
            top: '125px',
            zIndex: 2,
            border: '1px solid #FFFFFF',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: '5px',
              transform: 'scale(275%)',
            }}
          >
            <ProjecImage name={project.name} image={project.image} />
          </div>
        </Box>

        <h2
          style={{
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            position: 'relative',
            marginTop: '150px',
          }}
        >
          {project.name}
        </h2>
        <Box
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            position: 'relative',
          }}
        >
          {project.tags?.map((tag, index) => (
            <Badge
              key={index}
              variant="outlined"
              style={{
                fontSize: 'small',
                fontWeight: '500',
                position: 'relative',
              }}
            >
              {tag}
            </Badge>
          ))}
        </Box>
        {project.url && (
          <Button
            as="a"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="solid"
            size="sm"
            leftIcon="ExternalLink"
            color="intentsBase8"
            intent="info"
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              overflow: 'hidden',
              position: 'fixed',
              top: '220px',
              right: '15px',
              zIndex: 2,
            }}
          >
            Visit Website
          </Button>
        )}

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
