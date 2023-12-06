import { Box, Card, Text, Button, Tag } from '@fuel-ui/react';
import React from 'react';

import type { Project } from '../../types';
import { ProjecImage } from '../ProjectImage';

import { styles } from './styles';

interface CardComponentProps {
  project: Project;
  onSelect: (project: Project) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  applyFadeEffect?: boolean;
  isFadingIn?: boolean;
}

const CardComponent: React.FC<CardComponentProps> = ({
  project,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  applyFadeEffect,
  isFadingIn,
}) => {
  if (!project) return null;
  const cardStyle = applyFadeEffect
    ? isFadingIn
      ? styles.fadeIn
      : styles.fadeOut
    : {};

  return (
    <Box
      onClick={() => onSelect(project)}
      css={cardStyle} // Apply conditional styling
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {' '}
      <Card
        variant="outlined"
        css={styles.card}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Card.Header css={styles.cardHeader}>
          <Box css={styles.projectImageWrapper}>
            <Box css={styles.image}>
              <ProjecImage name={project.name} image={project.image} />
            </Box>
          </Box>
          <Box css={styles.statusContainer}>
            {project.tags?.map((tag, index) => (
              <Tag
                key={index}
                variant="ghost"
                intent="info"
                size="xs"
                style={{
                  fontSize: '$xs',
                  fontWeight: '500',
                }}
                css={styles.tag}
              >
                {tag}
              </Tag>
            ))}
          </Box>
        </Card.Header>
        <Card.Body css={styles.cardBody}>
          <Text fontSize="base" color="intentsBase12" css={styles.header}>
            {project.name}
          </Text>
          <Box css={styles.cardContent}>
            <Text>{project.description}</Text>
          </Box>
        </Card.Body>
        <Card.Footer css={styles.cardFooter} gap="$3" direction="row-reverse">
          {project.isLive ? (
            <Button
              intent="base"
              size="sm"
              variant="outlined"
              css={styles.button}
            >
              <Box css={styles.dotLive} />
              Testnet
            </Button>
          ) : (
            <Button
              intent="base"
              size="sm"
              variant="outlined"
              css={styles.button}
            >
              <Box css={styles.dotBuilding} />
              {'Building'}
            </Button>
          )}
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '5px',
              marginLeft: 'auto',
            }}
          >
            {project.twitter && (
              <Button
                href={project.twitter}
                size="sm"
                intent="error"
                variant="ghost"
                leftIcon={'BrandX'}
                css={styles.button}
              ></Button>
            )}
            {project.github && (
              <Button
                href={project.github}
                size="sm"
                leftIcon={'BrandGithub'}
                variant="ghost"
                css={styles.button}
              ></Button>
            )}
            {project.discord && (
              <Button
                href={project.discord}
                size="sm"
                intent="info"
                leftIcon={'BrandDiscord'}
                variant="ghost"
                css={styles.button}
              ></Button>
            )}
            <Button
              size="sm"
              variant="outlined"
              intent="base"
              leftIcon={'ExternalLink'}
              css={styles.button}
            ></Button>
          </Box>
        </Card.Footer>
      </Card>
    </Box>
  );
};

export default CardComponent;
