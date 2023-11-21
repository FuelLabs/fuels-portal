import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Heading,
  Card,
  Text,
  Button,
  IconButton,
  Tag,
} from '@fuel-ui/react';
import React, { useState, useEffect } from 'react';

import type { Project } from '../../types';
import { ProjecImage } from '../ProjectImage';

const FeaturedProjects = ({ projects }: { projects: Project[] }) => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [nextProjectIndex, setNextProjectIndex] = useState<number | null>(null);
  const [, setIsHovering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Define animation classes as strings
  const slideInAnimation = 'slideIn 0.5s ease-in-out forwards';
  const slideOutAnimation = 'slideOut 0.5s ease-in-out forwards';
  const changeProject = (newIndex: number) => {
    console.log(`Changing project to index: ${newIndex}`);
    setNextProjectIndex(newIndex);
    setAnimationClass(slideOutAnimation);
  };

  const nextProject = () => {
    const newIndex = (currentProjectIndex + 1) % projects.length;
    changeProject(newIndex);
  };

  const prevProject = () => {
    const newIndex =
      (currentProjectIndex - 1 + projects.length) % projects.length;
    changeProject(newIndex);
  };

  const onMouseEnterHandler = () => {
    setIsHovering(true);
    setIsPaused(true); // Pause the animation
  };

  const onMouseLeaveHandler = () => {
    setIsHovering(false);
    setIsPaused(false); // Resume the animation
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextProject(); // Call the function to go to the next project
      }, 3000); // Change project every 3 seconds

      return () => clearInterval(interval); // Clear interval on unmount
    }
  }, [currentProjectIndex, projects.length, isPaused]);

  useEffect(() => {
    if (
      !isPaused &&
      animationClass === slideOutAnimation &&
      nextProjectIndex !== null
    ) {
      const timer = setTimeout(() => {
        setCurrentProjectIndex(nextProjectIndex);
        setAnimationClass(slideInAnimation);
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [nextProjectIndex, animationClass, isPaused]);

  useEffect(() => {
    console.log(
      `Next project index: ${nextProjectIndex}, Animation class: ${animationClass}`
    );
    if (
      !isPaused &&
      animationClass === slideOutAnimation &&
      nextProjectIndex !== null
    ) {
      setTimeout(() => {
        setCurrentProjectIndex(nextProjectIndex);
        setAnimationClass(slideInAnimation);
      }, 600);
    }
  }, [nextProjectIndex, animationClass, isPaused]);

  const currentProject = projects[currentProjectIndex];

  const handleDotClick = (index: number) => {
    changeProject(index);
  };

  return (
    <>
      <style>{`
      @keyframes slideIn {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }

      @keyframes slideOut {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(-145%); opacity: 0; }
      }
    `}</style>
      <Box css={styles.container}>
        <Box>
          <Box>
            <Card
              variant="outlined"
              css={{ ...styles.card, animation: animationClass }}
              onMouseEnter={onMouseEnterHandler}
              onMouseLeave={onMouseLeaveHandler}
            >
              <Card.Header css={styles.cardHeader}>
                <Box css={styles.projectImageWrapper}>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: '6.45px',
                      transform: 'scale(170%)',
                    }}
                  >
                    <ProjecImage
                      name={currentProject.name}
                      image={currentProject.image}
                    />
                  </div>
                </Box>
                <Box css={styles.statusContainer}>
                  {currentProject.tags?.map((tag, index) => (
                    <Tag
                      key={index}
                      variant="outlined"
                      intent="info"
                      size="sm"
                      style={{
                        fontSize: 'small',
                        fontWeight: '500',
                        position: 'relative',
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </Box>
              </Card.Header>
              <Card.Body css={styles.cardBody}>
                <Heading as="h3" css={styles.header}>
                  {currentProject.name}
                </Heading>
                <Box css={styles.cardContent}>
                  <Text>{currentProject.description}</Text>
                </Box>
              </Card.Body>
              <Card.Footer
                css={styles.cardFooter}
                gap="$3"
                direction="row-reverse"
              >
                {currentProject.isLive ? (
                  <Button intent="base" size="sm" variant="outlined">
                    <Box css={styles.dotLive} />
                    {'Live on Testnet'}
                  </Button>
                ) : (
                  <Button intent="base" size="sm" variant="outlined">
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
                  {currentProject.twitter && (
                    <Button
                      href={currentProject.twitter}
                      size="sm"
                      intent="error"
                      variant="ghost"
                      leftIcon={'BrandX'}
                    ></Button>
                  )}
                  {currentProject.github && (
                    <Button
                      href={currentProject.github}
                      size="sm"
                      leftIcon={'BrandGithub'}
                      variant="ghost"
                    ></Button>
                  )}
                  {currentProject.discord && (
                    <Button
                      href={currentProject.discord}
                      size="sm"
                      intent="info"
                      leftIcon={'BrandDiscord'}
                      variant="ghost"
                    ></Button>
                  )}
                  <Button
                    size="sm"
                    variant="outlined"
                    intent="base"
                    leftIcon={'ExternalLink'}
                  >
                    Visit Website
                  </Button>
                </Box>
              </Card.Footer>
            </Card>
          </Box>
        </Box>
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
      </Box>
    </>
  );
};

const styles = {
  container: cssObj({
    padding: '1rem',
    borderRadius: '$lg',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '200px',
    overflow: 'hidden',
  }),
  card: cssObj({
    width: '750px',
    margin: '0 auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '$lg',
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
  cardHeader: cssObj({
    //backgroundImage:'url(https://fuel-labs.ghost.io/content/images/size/w2000/2023/09/Background.png)',
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
    padding: '15px',
    flex: '1 1 auto', // Allow the body to grow and shrink as needed
    minHeight: '120px', // Set a minimum height for the body
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
    marginRight: '1rem',
  }),
  header: cssObj({
    //color: '#00F58C',
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
    color: '$intentsBase12',
    borderRadius: '$sm',
    padding: '0 $1',
    backgroundColor: '$gray5',
    marginRight: '8px',
  }),
  statusContainer: cssObj({
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
  }),
};

export default FeaturedProjects;
