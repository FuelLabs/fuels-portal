import { cssObj } from '@fuel-ui/css';
import { Box, Heading, Card, Text } from '@fuel-ui/react';
import React from 'react';

import type { Project } from '../../types';
import { ProjecImage } from '../ProjectImage';

const FeaturedProjects = ({ projects }: { projects: Project[] }) => {
  const firstProject = projects[0];

  return (
    <Box css={styles.container}>
      <Box
        css={{
          width: '85%',
        }}
      >
        <Card variant="outlined">
          <Card.Header css={styles.cardHeader}>
            <Box css={styles.projectImageWrapper}>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: '6.5px',
                  transform: 'scale(170%)',
                }}
              >
                <ProjecImage
                  name={firstProject.name}
                  image={firstProject.image}
                />
              </div>
            </Box>
            <Heading as="h2">{firstProject.name}</Heading>
          </Card.Header>
          <Card.Body>
            <Box css={styles.cardContent}>
              <Text>{firstProject.description}</Text>
            </Box>
          </Card.Body>
        </Card>
      </Box>
    </Box>
  );
};

const styles = {
  container: cssObj({
    padding: '$4',
    borderRadius: '$sm',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  }),
  cardHeader: cssObj({
    backgroundImage:
      'url(https://fuel-labs.ghost.io/content/images/size/w2000/2023/09/Background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    borderTopLeftRadius: '$sm',
    borderTopRightRadius: '$sm',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
  }),
  projectImageWrapper: cssObj({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '68px',
    height: '68px',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
    border: '1px solid #FFFFFF',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)',
    marginRight: '1rem',
  }),
  cardContent: cssObj({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }),
};

export default FeaturedProjects;
