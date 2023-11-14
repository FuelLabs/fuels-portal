import { cssObj } from '@fuel-ui/css';
import { Box, Heading, Card, Text, Button, IconButton } from '@fuel-ui/react';
import React, { useState, useEffect } from 'react';

import type { Project } from '../../types';
import { ProjecImage } from '../ProjectImage';

const FeaturedProjects = ({ projects }: { projects: Project[] }) => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [nextProjectIndex, setNextProjectIndex] = useState(1);
  const [slide, setSlide] = useState(false);

  const nextProject = () => {
    setSlide(true);
    setTimeout(() => {
      setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % projects.length);
      setNextProjectIndex((nextIndex) => (nextIndex + 1) % projects.length);
      setSlide(false);
    }, 500);
  };

  const prevProject = () => {
    setCurrentProjectIndex(
      (prevIndex) => (prevIndex - 1 + projects.length) % projects.length
    );
    setNextProjectIndex(
      (nextIndex) => (nextIndex - 1 + projects.length) % projects.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextProject();
    }, 5000);

    return () => clearInterval(interval);
  }, [projects.length]);

  const carouselWrapperStyle = {
    ...styles.carouselWrapper,
    width: projects.length > 1 ? '100%' : '50%',
  };

  const handleDotClick = (index: number) => {
    setCurrentProjectIndex(index);
    setNextProjectIndex((index + 1) % projects.length);
  };
  return (
    <Box css={styles.container}>
      <Box css={carouselWrapperStyle}>
        {/* Arrow Left */}
        <IconButton
          variant="link"
          intent="base"
          onClick={prevProject}
          aria-label="Previous Project"
          icon={'ArrowLeft'}
          css={styles.arrowButton}
        />

        <Box css={{ ...styles.cardWrapper, ...(slide && styles.slideEffect) }}>
          <ProjectCard project={projects[nextProjectIndex]} />
          <ProjectCard project={projects[currentProjectIndex]} />
          <ProjectCard project={projects[nextProjectIndex]} />
        </Box>

        {/* Arrow Right */}
        <IconButton
          variant="link"
          intent="base"
          onClick={nextProject}
          aria-label="Next Project"
          icon={'ArrowRight'}
          css={styles.arrowButton}
        />
      </Box>
      <Box css={styles.dotsContainer}>
        {projects.map((_, index) => (
          <Box
            key={index}
            css={index === currentProjectIndex ? styles.activeDot : styles.dot}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

const ProjectCard = ({ project }: { project: Project }) => (
  <Card variant="ghost" css={styles.card}>
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
          <ProjecImage name={project.name} image={project.image} />
        </div>
      </Box>
      <Heading as="h2">{project.name}</Heading>
    </Card.Header>
    <Card.Body>
      <Box css={styles.cardContent}>
        <Text>{project.description}</Text>
      </Box>
    </Card.Body>
    <Card.Footer gap="$3" direction="row-reverse">
      <Button size="sm" variant="ghost" intent="info" leftIcon={'ExternalLink'}>
        Visit Website
      </Button>
    </Card.Footer>
  </Card>
);

const styles = {
  container: cssObj({
    background: '#00F58C',
    padding: '1rem',
    borderRadius: '$lg',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '250px',
    overflow: 'hidden',
  }),
  card: cssObj({
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    width: '750px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '$lg',
    margin: '0 20px',
  }),
  cardHeader: cssObj({
    backgroundImage:
      'url(https://fuel-labs.ghost.io/content/images/size/w2000/2023/09/Background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: '$lg',
    borderTopRightRadius: '$lg',
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
    border: '1px solid #E2E2E2',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)',
    marginRight: '1rem',
  }),
  cardContent: cssObj({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }),
  navigation: cssObj({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  }),
  arrowContainer: cssObj({
    padding: '0 10px',
  }),
  arrowButton: cssObj({
    // Add styles for positioning and visibility
  }),
  carouselWrapper: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'visible', // Change to visible to prevent cropping
    position: 'relative',
  }),
  slideEffect: cssObj({
    transform: 'translateX(-50%)', // Adjust to center the focused card
  }),
  cardWrapper: cssObj({
    display: 'flex',
    transition: 'transform 1s ease-out',
    justifyContent: 'flex-start', // Start alignment to control the focus
    width: '300%', // Increase width to accommodate all cards
  }),
  dotsContainer: cssObj({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  }),
  dot: cssObj({
    height: '10px',
    width: '10px',
    backgroundColor: '#bbb',
    borderRadius: '50%',
    margin: '0 5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#888',
    },
  }),
  activeDot: cssObj({
    height: '10px',
    width: '10px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    margin: '0 5px',
    cursor: 'pointer',
  }),
};

export default FeaturedProjects;
