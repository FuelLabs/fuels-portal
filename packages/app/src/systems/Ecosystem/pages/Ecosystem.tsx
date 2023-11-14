import { cssObj } from '@fuel-ui/css';
import { Box, Button, Heading, Input, Icon } from '@fuel-ui/react';
import { useState } from 'react';
import { Layout, animations } from '~/systems/Core';

import { EcosystemTags } from '../components/EcosystemTags';
import { FeaturedProjects } from '../components/FeaturedProjects';
import { ProjectDetailPanel } from '../components/ProjectDetailPanel';
import { ProjectList } from '../components/ProjectList/ProjectList';
import { useEcosystem } from '../hooks/useEcosystem';
import type { Project } from '../types';

export function Ecosystem() {
  const { tags, isLoading, filter, search, handlers, filteredProjects } =
    useEcosystem();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlers.searchProjects({ query: e.target.value });
  };

  const handleTagButtonClick = (tag: string) => {
    handlers.filterProjects({ tag });
  };

  const emptyText = search?.length
    ? 'No results found for your search.'
    : undefined;

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const handleProjectSelect = (project: Project) => {
    console.log('Project selected:', project);
    setSelectedProject(project);
  };

  const handleClosePanel = () => {
    console.log('Closing panel');
    setSelectedProject(null);
  };
  const featuredProjects = filteredProjects
    ? filteredProjects.filter((project) => project.isLive)
    : [];

  return (
    <Layout {...animations.slideInTop()}>
      <Layout.Content css={{ padding: '$16 $1 $4 $4' }}>
        <Box.Stack gap="$12" grow={1} css={styles.content}>
          <Box.Flex css={styles.headingWrapper}>
            <Heading as="h1" css={styles.heading}>
              <Box.Stack gap="$2" wrap="wrap">
                Explore the Fuel Ecosystem
              </Box.Stack>
            </Heading>
          </Box.Flex>
          <Box.Flex
            css={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Input css={styles.searchBar}>
              <Input.Field
                name="search"
                placeholder="Search"
                type="text"
                onChange={handleSearch}
                value={search || ''}
              />
              <Input.ElementRight element={<Icon icon="Search" />} />
            </Input>
            <a
              href="https://fuelnetwork.typeform.com/addproject"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="solid" intent="primary" size="md">
                List your dapp
              </Button>
            </a>
          </Box.Flex>
          <Heading as="h2" css={styles.heading}>
            Featured Projects
          </Heading>
          <Box>
            {featuredProjects.length > 0 && (
              <FeaturedProjects projects={featuredProjects} />
            )}
          </Box>
          <Box css={styles.divider}></Box>
          <EcosystemTags
            tags={tags}
            onPressTag={handleTagButtonClick}
            activeTag={filter}
            onPressAllCategories={handlers.clearFilters}
            isLoading={isLoading}
          />
          <ProjectList
            isLoading={isLoading}
            projects={filteredProjects || []}
            emptyText={emptyText}
            onSelect={handleProjectSelect}
          />
          {selectedProject && (
            <ProjectDetailPanel
              project={selectedProject}
              onClose={handleClosePanel}
            />
          )}
        </Box.Stack>
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  content: cssObj({
    paddingBottom: '$20',
  }),
  heading: cssObj({
    margin: 0,
  }),
  subHeading: cssObj({
    fontSize: '0.875rem',
  }),
  headingWrapper: cssObj({
    flexDirection: 'column',
    gap: '$10',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    '@sm': {
      flexDirection: 'row',
      gap: '$10',
      alignItems: 'flex-end',
    },
  }),
  searchBar: cssObj({
    width: '50%',
    '@sm': {
      width: 'auto',
    },
  }),
  divider: cssObj({
    height: '0.5px',
    width: '100%',
    backgroundColor: '#E0E0E0',
  }),
};
