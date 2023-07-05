import { cssObj } from '@fuel-ui/css';
import { Text, Box, Heading, Input, Icon } from '@fuel-ui/react';

import { EcosystemTags } from '../components/EcosystemTags';
import { ProjectList } from '../components/ProjectList/ProjectList';
import { useEcosystem } from '../hooks/useEcosystem';

import { Layout, animations } from '~/systems/Core';

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

  return (
    <Layout {...animations.slideInTop()}>
      <Box.Flex css={styles.container} align="center" grow={1}>
        <Box.Stack gap="$10" grow={1}>
          <Box.Flex
            justify="space-between"
            align="flex-end"
            css={styles.headingWrapper}
          >
            <Box.Stack gap="$2" wrap="wrap">
              <Heading as="h3" css={styles.heading}>
                Explore Fuel Dapps
              </Heading>
              <Text as="small" fontSize="sm" color="intentsBase12">
                Here&apos;s a list of dapps built on Fuel
              </Text>
            </Box.Stack>
            <Input size="sm">
              <Input.Field
                name="search"
                placeholder="Search"
                type="text"
                onChange={handleSearch}
                value={search || ''}
              />
              <Input.ElementRight element={<Icon icon="Search" />} />
            </Input>
          </Box.Flex>
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
          />
        </Box.Stack>
      </Box.Flex>
    </Layout>
  );
}

const styles = {
  heading: cssObj({
    margin: 0,
  }),
  subHeading: cssObj({
    fontSize: '0.875rem',
  }),
  headingWrapper: cssObj({
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '$10',
    },
  }),
  wrapper: cssObj({}),
  container: cssObj({
    marginTop: '$12',
    maxWidth: '$xl',
    padding: '$24 $40',
    margin: '0 auto',

    '@media (max-width: 768px)': {
      maxWidth: '100%',
    },
  }),
};
