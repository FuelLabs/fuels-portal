import { cssObj } from '@fuel-ui/css';
import { Text, Box, Heading, Input, Icon } from '@fuel-ui/react';

import { EcosystemTags } from '../components/EcosystemTags';
import { ProjectList } from '../components/ProjectList/ProjectList';
import { SAMPLE_PROJECTS } from '../components/ProjectList/ProjectList.stories';

import { Layout } from '~/systems/Core';

const SAMPLE_TAGS = ['Games', 'DeFi', 'NFTs', 'DAOs', 'Social', 'Lending'];

export function Ecosystem() {
  return (
    <Layout>
      <Box.Flex style={styles.wrapper} justify="center">
        <Box.Flex css={styles.container} align="center">
          <Box.Stack gap="$10">
            <Box.Flex
              justify="space-between"
              align="bottom"
              css={{ marginTop: '$12' }}
            >
              <Box.Stack gap={0}>
                <Heading as="h2" css={{ margin: 0 }}>
                  Explore Fuel Dapps
                </Heading>
                <Text as="small">Here&apos;s a list of apps built on Fuel</Text>
              </Box.Stack>
              <Box.Stack>
                <Input>
                  <Input.Field name="search" placeholder="Search" type="text" />
                  <Input.ElementRight element={<Icon icon="Search" />} />
                </Input>
              </Box.Stack>
            </Box.Flex>
            <EcosystemTags tags={SAMPLE_TAGS} />
            <ProjectList projects={SAMPLE_PROJECTS} />
          </Box.Stack>
        </Box.Flex>
      </Box.Flex>
    </Layout>
  );
}

const styles = {
  wrapper: cssObj({}),
  container: cssObj({
    maxWidth: '$xl',
    padding: '$12',

    '@media (max-width: 768px)': {
      maxWidth: '100%',
    },
  }),
};
