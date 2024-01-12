import { cssObj } from '@fuel-ui/css';
import { Box, Card, Button, Text } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { type FC } from 'react';
import React, { useState } from 'react';
import { animations } from '~/systems/Core';

import type { Project } from '../../types';
import { ProjectDetailPanel } from '../ProjectDetailPanel';
import { ProjectImage } from '../ProjectImage';

import { ProjectItemLoader } from './ProjectItemLoader';

const MotionCard = motion(Card);

export type ProjectItemProps = Project & {
  onPress?: () => void;
  onSelect?: (project: Project) => void;
};

type ProjectItemComponent = FC<ProjectItemProps> & {
  Loader: typeof ProjectItemLoader;
};

export const ProjectItem: ProjectItemComponent = ({
  name,
  description,
  image,
  url,
  twitter,
  discord,
  github,
  isLive,
  tags,
  banner,
}: ProjectItemProps) => {
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const onCardPress = () => {
    setSelectedProject({
      name,
      description,
      image,
      url,
      twitter,
      discord,
      github,
      isLive,
      tags,
      banner,
    });
    setIsPanelVisible(true);
  };

  const handleClosePanel = () => {
    setIsPanelVisible(false);
    setSelectedProject(null); // Reset the selected project when closing the panel
  };

  const renderPanel = () => {
    if (selectedProject && isPanelVisible) {
      return (
        <Box
          css={isPanelVisible ? styles.panelVisible : styles.panelHidden}
          onAnimationEnd={() => {
            if (!isPanelVisible) setSelectedProject(null);
          }}
        >
          <ProjectDetailPanel
            project={selectedProject}
            onClose={handleClosePanel}
          />
        </Box>
      );
    }
    return null;
  };

  return (
    <>
      <MotionCard
        withDividers
        {...animations.appearIn({
          transition: { type: 'spring' },
        })}
        onClick={onCardPress}
        variant="outlined"
        css={styles.card}
      >
        <Card.Body css={styles.body}>
          <Box css={styles.image}>
            <ProjectImage name={name} image={image} />
          </Box>
          <Box.Stack gap="$2" justify="space-between" css={styles.details}>
            <Box.Stack align="flex-start" gap="$1">
              <Box.Flex
                align="flex-start"
                justify="space-between"
                css={styles.title}
              >
                <Text fontSize="base" color="intentsBase12">
                  {name}
                </Text>
              </Box.Flex>
              <Text fontSize="sm"> {description}</Text>
            </Box.Stack>
          </Box.Stack>
        </Card.Body>
        <Card.Footer css={styles.cardFooter} gap="$3" direction="row-reverse">
          {isLive ? (
            <Button intent="base" size="xs" variant="outlined">
              <Box css={styles.dot} />
              {'Testnet Ready'}
            </Button>
          ) : (
            <Button intent="base" size="xs" variant="outlined">
              <Box css={styles.dotBuilding} />
              {'Building'}
            </Button>
          )}
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              marginLeft: 'auto',
            }}
          >
            {twitter && (
              <Button
                as="a"
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                size="xs"
                intent="base"
                variant="ghost"
                leftIcon={'BrandX'}
              ></Button>
            )}
            {github && (
              <Button
                as="a"
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                size="xs"
                intent="base"
                leftIcon={'BrandGithub'}
                variant="ghost"
              ></Button>
            )}
            {discord && (
              <Button
                as="a"
                href={discord}
                target="_blank"
                rel="noopener noreferrer"
                size="xs"
                intent="base"
                leftIcon={'BrandDiscord'}
                variant="ghost"
              ></Button>
            )}
            <Button
              as="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              variant="outlined"
              intent="base"
              leftIcon={'ExternalLink'}
            ></Button>
          </Box>
        </Card.Footer>
      </MotionCard>
      {renderPanel()}
    </>
  );
};

const styles = {
  card: cssObj({
    transition: 'transform 0.2s ease-in-out, border 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      textDecoration: 'none !important',
      border: '1px solid $intentsBase8',
      backgroundImage:
        'linear-gradient($transparent, rgb(15, 15, 15)) !important',
      'html[class="fuel_light-theme"] &': {
        backgroundImage:
          'linear-gradient($transparent, rgb(245, 245, 245)) !important',
      },
    },
  }),
  image: cssObj({
    height: '40px',
    width: '40px',
    border: '1px solid $intentsBase8',
    borderRadius: '$sm',
    overflow: 'hidden',
  }),
  cardFooter: cssObj({
    flex: '0 0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  }),
  details: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }),

  link: cssObj({
    textDecoration: 'underline',
    padding: '0',
    pointerEvents: 'none',
  }),
  dot: cssObj({
    width: '$1',
    height: '$1',
    borderRadius: '50%',
    border: '1px solid #A9F6D5',
    background: '#00F58C',
    boxShadow: '0px 0px 4px 0px #00F58C',
  }),
  dotBuilding: cssObj({
    width: '$1',
    height: '$1',
    borderRadius: '50%',
    border: '1px solid #E5C06F',
    background: '#F3B42C',
    boxShadow: '0px 0px 4px 0px #F3B42C',
  }),
  tag: cssObj({
    color: '$intentsBase12',
    borderRadius: '$sm',
    padding: '0 $1',
    backgroundColor: '$gray5',
    marginRight: '8px',
  }),
  title: cssObj({
    width: '100%',
    fontWeight: 'bold',
  }),
  body: cssObj({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '$4',
    justifyContent: 'flex-start',
    padding: '$6',
    flex: '1 1 auto',
    minHeight: '95px',
  }),
  statusContainer: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 'auto',
  }),
  panelVisible: cssObj({
    position: 'fixed',
    right: 0,
    top: 0,
    height: '100%',
    width: '100%',
    animation: 'slideIn 0.5s forwards',
  }),

  panelHidden: cssObj({
    position: 'fixed',
    right: 0,
    top: 0,
    height: '100%',
    width: '100%',
    animation: 'slideOut 0.5s forwards',
  }),
};

ProjectItem.Loader = ProjectItemLoader;
