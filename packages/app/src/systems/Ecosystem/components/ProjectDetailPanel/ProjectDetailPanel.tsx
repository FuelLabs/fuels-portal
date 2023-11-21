import { cssObj } from '@fuel-ui/css';
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
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 750);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 750);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
            backdropFilter: 'blur(3px)',
            zIndex: 999,
            transition: 'backdropFilter 0.5s ease',
          }}
        ></div>
      )}
      <Box ref={panelRef} css={styles.panelStyle} data-mobile={isMobileView}>
        <div
          style={{
            backgroundImage:
              'url(https://assets-global.website-files.com/62e273f312d561347ce33306/62f124d39576fd474e271ab8_Fuel_Trailer_Still_4.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '200px',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            borderBottom: '1px solid #2E2E2E',
          }}
        >
          <Box css={styles.closeButton}>
            <TagCloseButton onPress={onClose} />
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
            border: '1px solid #2E2E2E',
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
        <Alert status="info">
          <Alert.Description style={{ fontSize: '13px' }}>
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
      </Box>
    </>
  );
};

const styles = {
  panelStyle: cssObj({
    flexDirection: 'column',
    alignItems: 'start',
    position: 'fixed',
    right: 0,
    top: 0,
    height: '100%',
    width: '50%',
    backgroundColor: '$intentsBase1',
    padding: '30px',
    overflowY: 'auto',
    zIndex: 1000,
    borderLeft: '0.5px solid #2E2E2E',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)',
    '&[data-mobile="true"]': {
      width: '85%',
    },
  }),
  closeButton: cssObj({
    display: 'flex',
    position: 'fixed',
    top: 15,
    right: 15,
    backgroundColor: '$intentsBase3',
    borderRadius: '$md',
    height: '25px',
    width: '25px',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  }),
};

export default ProjectDetailPanel;
