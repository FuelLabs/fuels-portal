import { cssObj } from '@fuel-ui/css';
import { Box, Card, Text, Button, IconButton, Tag } from '@fuel-ui/react';
import React, { useState, useEffect } from 'react';

import type { Project } from '../../types';
import { ProjectDetailPanel } from '../ProjectDetailPanel';
import { ProjecImage } from '../ProjectImage';

const FeaturedProjects = ({ projects }: { projects: Project[] }) => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleClosePanel = () => {
    setSelectedProject(null);
  };
  const isSingleProject = projects.length === 1;

  const nextProject = () => {
    setCurrentProjectIndex((currentProjectIndex + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProjectIndex(
      (currentProjectIndex - 1 + projects.length) % projects.length
    );
  };

  const onMouseEnterHandler = () => {
    setIsPaused(true);
  };

  const onMouseLeaveHandler = () => {
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextProject();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentProjectIndex, isPaused]);

  useEffect(() => {
    const handleResize = () => {
      // Handle window resize if necessary
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentProjectIndex(index);
    // Decide the animation direction based on index
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const CardComponent = ({ project }: { project: Project }) => (
    <Box onClick={() => handleProjectSelect(project)}>
      <Card
        variant="outlined"
        css={styles.card}
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
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
                variant="outlined"
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

  return (
    <>
      <Box css={styles.gridContainer}>
        <CardComponent project={projects[currentProjectIndex]} />
        {!isSingleProject && windowWidth > 768 && (
          <CardComponent
            project={projects[(currentProjectIndex + 1) % projects.length]}
          />
        )}
      </Box>
      {!isSingleProject && (
        <Box css={styles.dotsContainer}>
          <IconButton
            variant="link"
            intent="base"
            onClick={prevProject}
            aria-label="Previous Project"
            icon={'ArrowLeft'}
            css={styles.arrowButton}
          />
          {projects.map((_, index) => (
            <Box
              key={index}
              css={
                index === currentProjectIndex ? styles.activeDot : styles.dot
              }
              onClick={() => handleDotClick(index)}
            />
          ))}
          <IconButton
            variant="link"
            intent="base"
            onClick={nextProject}
            aria-label="Next Project"
            icon={'ArrowRight'}
            css={styles.arrowButton}
          />
        </Box>
      )}
      {selectedProject && (
        <ProjectDetailPanel
          project={selectedProject}
          onClose={handleClosePanel}
        />
      )}
    </>
  );
};

const styles = {
  gridContainer: cssObj({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Two cards for larger screens
    gap: '1rem',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr', // One card for smaller screens
    },
  }),
  card: cssObj({
    flex: '1 0 50%',
    maxHeight: '500px',
    margin: '0 auto',
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '$md',
    overflow: 'hidden',
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
  button: cssObj({
    // ... existing styles for button ...
    '@media (max-width: 768px)': {
      fontSize: '0.8rem', // Smaller button and font size on small screens
      padding: '5px 10px',
    },
    '@media (min-width: 601px) and (max-width: 1024px)': {
      fontSize: '0.9rem', // Medium button and font size on medium screens
      padding: '8px 15px',
    },
    '@media (min-width: 1025px)': {
      fontSize: '1rem', // Larger button and font size on large screens
      padding: '10px 20px',
    },
  }),
  cardHeader: cssObj({
    backgroundImage:
      'url(https://fuel-labs.ghost.io/content/images/size/w2000/2023/09/Background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
  }),
  cardFooter: cssObj({
    height: '60px', // Set a fixed height for the footer
    display: 'flex',
    alignItems: 'center', // Center the content vertically
    justifyContent: 'space-between', // Distribute space between items
    padding: '0 15px', // Add some padding for aesthetics
  }),
  cardBody: cssObj({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: '1 1 auto',
    '@media (max-width: 768px)': {
      paddingTop: '8px',
      paddingLeft: '15px',
      paddingRight: '15px',
      minHeight: '115px',
      fontSize: '0.85rem', // Smaller font size on small screens
    },
    '@media (min-width: 601px) and (max-width: 1024px)': {
      paddingTop: '8px',
      paddingLeft: '15px',
      paddingRight: '15px',
      minHeight: '120px',
      fontSize: '1rem', // Smaller font size on small screens
    },
    '@media (min-width: 1025px)': {
      paddingTop: '8px',
      paddingLeft: '15px',
      paddingRight: '15px',
      minHeight: '140px',
      fontSize: '1rem', // Smaller font size on small screens
    },
  }),
  projectImageWrapper: cssObj({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '65px',
    height: '65px',
    borderRadius: '$md',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid #E2E2E2',
    marginRight: '1rem',
    '@media (max-width: 320px)': {
      width: '40px',
      height: '40px',
    },
  }),
  image: cssObj({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '6.45px',
    transform: 'scale(170%)',
    '@media (max-width: 320px)': {
      transform: 'scale(100%)',
    },
  }),
  header: cssObj({
    fontWeight: 'bold',
    paddingBottom: '8px',
    paddingTop: '8px',
    '@media (max-width: 768px)': {
      fontSize: '1rem', // Smaller font size on small screens
    },
    '@media (min-width: 601px) and (max-width: 1024px)': {
      fontSize: '1.2rem', // Medium font size on medium screens
    },
    '@media (min-width: 1025px)': {
      fontSize: '1.3rem', // Larger font size on large screens
    },
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
  dotsContainer: cssObj({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  }),
  dotLive: cssObj({
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
  dot: cssObj({
    height: '10px',
    width: '10px',
    backgroundColor: '#BBB',
    borderRadius: '50%',
    margin: '0 5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#FFFFFF',
    },
  }),
  activeDot: cssObj({
    height: '10px',
    width: '10px',
    backgroundColor: '#00F58C',
    borderRadius: '50%',
    margin: '0 5px',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  }),
  tag: cssObj({
    borderRadius: '5px',
    paddingLeft: '5px',
    paddingRight: '5px',
    //paddingTop: '1px',
    '@media (max-width: 768px)': {
      fontSize: '0.65rem', // Smaller font size on small screens
    },
    '@media (min-width: 601px) and (max-width: 1024px)': {
      fontSize: '0.65rem', // Medium font size on medium screens
    },
    '@media (min-width: 1025px)': {
      fontSize: '0.9rem', // Larger font size on large screens
    },
  }),
  statusContainer: cssObj({
    position: 'absolute',
    bottom: '16px',
    right: '10px',
    display: 'flex',
    flexDirection: 'row',
    flexwrap: 'wrap',
    gap: '10px',
    marginLeft: '90px',
    '@media (max-width: 320px)': {
      alignItems: 'end', // Align items to the start of the container
      marginLeft: '60px',
      gap: '1px',
    },
    '@media (max-width: 768px)': {
      alignItems: 'end', // Align items to the start of the container
      gap: '3px',
    },
    '@media (max-width: 1000px)': {
      alignItems: 'end', // Align items to the start of the container
      gap: '3px',
    },
  }),
};

export default FeaturedProjects;
