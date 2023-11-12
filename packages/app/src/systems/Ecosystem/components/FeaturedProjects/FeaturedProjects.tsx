import { cssObj } from '@fuel-ui/css';
import { Box, Heading, Text } from '@fuel-ui/react';
import React from 'react';

const FeaturedProjects = () => {
  return (
    <Box css={styles.container}>
      <Heading as="h3">Featured Projects</Heading>
      <Text>Static content for testing</Text>
      {/* You can add more static elements here for testing */}
    </Box>
  );
};

const styles = {
  container: cssObj({
    padding: '$4',
    margin: '$4',
    borderRadius: '$sm',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  }),
};

export default FeaturedProjects;
