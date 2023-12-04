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
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [, setSlideAnimation] = useState('');

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleClosePanel = () => {
    setSelectedProject(null);
  };
  const isSingleProject = projects.length === 1;

  const nextProject = () => {
    setIsFadingIn(false); // Start fade out
    setTimeout(() => {
      setCurrentProjectIndex((currentProjectIndex + 1) % projects.length);
      setIsFadingIn(true); // Start fade in
    }, 1000); // This duration should match the fade-out animation duration
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
      const interval = setInterval(nextProject, 3000);
      return () => clearInterval(interval);
    }
  }, [currentProjectIndex, isPaused]);

  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentProjectIndex(index);
  };

  useEffect(() => {
    const animation = windowWidth <= 768 ? 'slideMobile' : 'slideDesktop';
    setSlideAnimation(animation);
  }, [windowWidth]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProjectChange = () => {
    setIsFadingIn(false);
    setTimeout(() => {
      setCurrentProjectIndex((currentProjectIndex + 1) % projects.length);
      setIsFadingIn(true);
    }, 1000); // Duration of fadeOut animation
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(handleProjectChange, 3000);
      return () => clearInterval(interval);
    }
  }, [currentProjectIndex, isPaused]);

  const CardComponent = ({ project }: { project: Project }) => {
    return (
      <Box
        onClick={() => handleProjectSelect(project)}
        css={isFadingIn ? styles.fadeIn : styles.fadeOut}
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
      >
        {' '}
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

  return (
    <>
      <style>
        {`
            @keyframes fadeInEffect {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes fadeOutEffect {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `}
      </style>

      <Box
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
      >
        <Box css={styles.gridContainer}>
          <CardComponent project={projects[currentProjectIndex]} />
          {!isSingleProject && windowWidth > 740 && (
            <CardComponent
              project={projects[(currentProjectIndex + 1) % projects.length]}
            />
          )}
        </Box>
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
    position: 'relative',
    width: '100%',
    height: '100%',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    alignItems: 'center',
    '@media (max-width: 740px)': {
      gridTemplateColumns: '1fr',
    },
  }),
  card: cssObj({
    flex: '1 0 50%',
    margin: '0 auto',
    position: 'relative',
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '$md',
    overflow: 'hidden',
    width: '1fr%',
    transition: 'transform 0.3s ease', // Smooth transition for hover
    ':hover': {
      zIndex: 1, // Ensure hovered card is above others
    },
    // Define a custom property for the animation state
    '--animation-state': 'running',
    animationPlayState: 'var(--animation-state)',
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '$6',
    flex: '1 1 auto',
    minHeight: '95px',
    '@media (max-width: 350px)': {
      paddingTop: '8px',
      paddingLeft: '15px',
      paddingRight: '15px',
      minHeight: '136px',
      fontSize: '0.75rem', // Smaller font size on small screens
    },
    '@media (min-width: 351px) and (max-width: 740px)': {
      paddingTop: '8px',
      paddingLeft: '15px',
      paddingRight: '15px',
      minHeight: '130px',
      fontSize: '0.8rem', // Smaller font size on small screens
    },
    '@media (min-width: 741px) and (max-width: 1024px)': {
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
  arrowButton: cssObj({}),
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
  fadeIn: cssObj({
    animation: 'fadeInEffect 1s ease-in-out forwards',
    '&:hover': {
      opacity: 1, // Ensure the card is fully visible on hover
    },
  }),
  fadeOut: cssObj({
    animation: 'fadeOutEffect 1s ease-in-out forwards',
    '&:hover': {
      opacity: 1, // Ensure the card is fully visible on hover
    },
  }),
};

export default FeaturedProjects;
