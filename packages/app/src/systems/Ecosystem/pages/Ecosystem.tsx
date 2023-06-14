import { Text, Box, Heading, Input, Icon } from '@fuel-ui/react';

import { EcosystemTags } from '../components/EcosystemTags';

import { Layout } from '~/systems/Core';

const SAMPLE_TAGS = ['Games', 'DeFi', 'NFTs', 'DAOs', 'Social', 'Lending'];

export function Ecosystem() {
  return (
    <Layout>
      <Box.Container size="sm">
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
        </Box.Stack>
      </Box.Container>
    </Layout>
  );
}
