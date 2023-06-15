import { cssObj } from '@fuel-ui/css';
import { Text, Box, Heading, Input, Icon } from '@fuel-ui/react';

import { EcosystemTags } from '../components/EcosystemTags';
import { ProjectList } from '../components/ProjectList/ProjectList';
import { useEcosystem } from '../hooks/useEcosystem';

import { Layout } from '~/systems/Core';

export function Ecosystem() {
  const { tags, isLoading, filter, search, handlers, filteredProjects } =
    useEcosystem();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlers.searchProjects({ query: e.target.value });
  };

  const handleTagButtonClick = (tag: string) => {
    handlers.filterProjects({ tag });
  };
  return (
    <Layout>
      <Box.Flex style={styles.wrapper} justify="center">
        <Box.Flex css={styles.container} align="center" grow={1}>
          <Box.Stack gap="$10" grow={1}>
            <Box.Flex justify="space-between" align="bottom">
              <Box.Stack gap={0}>
                <Heading as="h2" css={styles.heading}>
                  Explore Fuel Dapps
                </Heading>
                <Text as="small">Here&apos;s a list of apps built on Fuel</Text>
              </Box.Stack>
              <Box.Stack>
                <Input>
                  <Input.Field
                    name="search"
                    placeholder="Search"
                    type="text"
                    onChange={handleSearch}
                    value={search}
                  />
                  <Input.ElementRight element={<Icon icon="Search" />} />
                </Input>
              </Box.Stack>
            </Box.Flex>
            {isLoading ? (
              <>
                <Text>Loading...</Text>
              </>
            ) : (
              <>
                <EcosystemTags
                  tags={tags}
                  onTagClick={handleTagButtonClick}
                  activeTag={filter}
                  onAllClick={handlers.clearFilters}
                />
                <ProjectList projects={filteredProjects} />
              </>
            )}
          </Box.Stack>
        </Box.Flex>
      </Box.Flex>
    </Layout>
  );
}

const styles = {
  heading: cssObj({
    margin: 0,
  }),
  wrapper: cssObj({
    marginTop: '$12',
  }),
  container: cssObj({
    maxWidth: '$xl',
    padding: '$12',

    '@media (max-width: 768px)': {
      maxWidth: '100%',
    },
  }),
};
