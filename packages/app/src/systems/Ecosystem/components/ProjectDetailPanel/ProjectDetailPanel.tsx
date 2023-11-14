import { Badge, Box, Button, Alert, TagCloseButton } from '@fuel-ui/react';
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
          width: '75%',
          backgroundColor: '#111111',
          padding: '30px',
          overflowY: 'auto',
          zIndex: 1000,
          borderLeft: '0.5px solid #FFFFFF',
          //transform: isPanelVisible ? 'translateX(0)' : 'translateX(100%)',
          //transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        }}
      >
        <div
          style={{
            backgroundImage:
              'url(https://assets-global.website-files.com/62e273f312d561347ce33306/62f124d39576fd474e271ab8_Fuel_Trailer_Still_4.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            //borderRadius: '8px',
            height: '200px',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            //boxShadow: '0px 0px 75px rgba(0, 245, 140, 0.5)',
            borderBottom: '1px solid #FFFFFF',
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
            <Button
              rightIconAriaLabel="close"
              size="xs"
              variant="ghost"
              intent="base"
              onPress={onClose}
            >
              <TagCloseButton />
            </Button>
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
              paddingTop: '6.5px',
              transform: 'scale(285%)',
            }}
          >
            <ProjecImage name={project.name} image={project.image} />
          </div>
        </Box>

        <h1
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
        </h1>
        <Box
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '10px',
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
        <Box
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            position: 'relative',
          }}
        >
          {project.status?.map((tag, index) => (
            <Badge
              key={index}
              variant="outlined"
              intent="info"
              style={{
                fontSize: 'small',
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
              //boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.4)',
              //border: '0.5px solid #FFFFFF',
            }}
          >
            Visit Website
          </Button>
        )}

        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          {project.description}
        </p>
        <Alert status="info">
          <Alert.Description style={{ fontSize: '11px' }}>
            The content here is provided by the app developers. Links and
            content are not verified nor endorsed by Fuel. If you have any
            questions, please contact the project directly.
          </Alert.Description>
        </Alert>
        <h2
          style={{
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            position: 'relative',
          }}
        >
          Socials
        </h2>
        <Box style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
          {project.twitter && (
            <Button
              href={project.twitter}
              size="sm"
              intent="error"
              variant="ghost"
              leftIcon={'BrandX'}
            >
              Twitter
            </Button>
          )}
          {project.github && (
            <Button
              href={project.github}
              size="sm"
              leftIcon={'BrandGithub'}
              variant="ghost"
            >
              GitHub
            </Button>
          )}
          {project.discord && (
            <Button
              href={project.discord}
              size="sm"
              intent="info"
              leftIcon={'BrandDiscord'}
              variant="ghost"
            >
              Discord
            </Button>
          )}
        </Box>
      </div>
    </>
  );
};

export default ProjectDetailPanel;