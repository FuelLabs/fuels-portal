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
  const [isAnimating, setIsAnimating] = useState(false);

  const changeProject = (newIndex: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentProjectIndex(newIndex);
      setIsAnimating(false);
    }, 500);
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

  useEffect(() => {
    const interval = setInterval(() => {
      nextProject();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentProjectIndex, projects.length]);

  const currentProject = projects[currentProjectIndex];

  const handleDotClick = (index: number) => {
    changeProject(index);
  };

  return (
    <Box css={styles.container}>
      <Box css={styles.carouselWrapper}>
        <Box>
          <Card
            variant="ghost"
            css={{
              ...styles.card,
              ...(isAnimating ? styles.fadeOut : styles.fadeIn),
            }}
          >
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
            css={index === currentProjectIndex ? styles.activeDot : styles.dot}
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
  );
};

const fadeInKeyframes = {
  from: { opacity: 0 },
  to: { opacity: 1 },
};

const fadeOutKeyframes = {
  from: { opacity: 1 },
  to: { opacity: 0 },
};
const styles = {
  container: cssObj({
    background: '#00F58C',
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
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    width: '750px',
    //border: '1px solid #D8D8D8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '$lg',
    overflow: 'hidden',
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
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)',
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
  carouselWrapper: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'calc(300px + 40px)',
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
    boxShadow: '0px 0px 4px 0px #00F58C',
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
    backgroundColor: '#FFF',
    borderRadius: '50%',
    margin: '0 5px',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
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
    bottom: '10px', // Adjust as needed
    right: '10px', // Adjust as needed
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
  }),
  fadeIn: cssObj({
    animationName: fadeInKeyframes,
    animationDuration: '0.5s',
    animationTimingFunction: 'ease-in-out',
  }),
  fadeOut: cssObj({
    animationName: fadeOutKeyframes,
    animationDuration: '0.5s',
    animationTimingFunction: 'ease-in-out',
  }),
};

export default FeaturedProjects;
