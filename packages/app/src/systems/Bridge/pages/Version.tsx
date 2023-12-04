/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Box, Card, Text } from '@fuel-ui/react';
import { Layout } from '~/systems/Core';

import { useCurrentVersion } from '../hooks/useCurrentVersion';
import { useStableVersion } from '../hooks/useStableVersion';

const Repo = ({
  name,
  version,
  isCorrect,
  isBig,
}: {
  name: string;
  version: string;
  isCorrect?: boolean;
  isBig?: boolean;
}) => {
  const fontSize = isBig ? 'lg' : 'base';
  return (
    <Alert status={isCorrect ? 'success' : 'warning'}>
      <Alert.Description>
        <Box.Flex justify={'space-between'} gap="$4">
          <Text fontSize={fontSize} color="intentsBase12">
            {name}
          </Text>
          <Text fontSize={fontSize} color="intentsBase12">
            {version}
          </Text>
        </Box.Flex>
      </Alert.Description>
    </Alert>
  );
};

export const Version = () => {
  const { repos: currentRepos } = useCurrentVersion();
  const { repos: stableRepos } = useStableVersion();

  return (
    <Layout>
      <Layout.Content>
        <Box.Flex gap="$20">
          <Card css={{ backgroundColor: '$intentsWarning2' }}>
            <Card.Body>
              <Box.Flex direction="column" gap="$10" css={{ flex: '1' }}>
                <Text
                  color="intentsWarning10"
                  fontSize="3xl"
                  css={{ textAlign: 'center' }}
                >
                  ⚠️ BETA-5 ⚠️
                </Text>
                <Box.Flex
                  gap="$10"
                  direction="column"
                  css={{ minWidth: 250, maxWidth: 250 }}
                >
                  {currentRepos.map((repo: any) => (
                    <Box.Flex direction="column" key={repo.name + repo.version}>
                      <Repo
                        name={repo.name}
                        version={repo.version}
                        isCorrect={repo.isCorrect}
                        isBig
                      />
                      <Box.Flex
                        direction="column"
                        css={{
                          alignSelf: 'flex-end',
                          '.fuel_Alert': {
                            py: '$1',
                            px: '$2',
                          },
                        }}
                      >
                        {repo.dependencies?.map((dependency: any) => (
                          <Repo
                            key={
                              dependency.name + dependency.version + dependency
                            }
                            name={dependency.name}
                            version={dependency.version}
                            isCorrect={dependency.isCorrect}
                          />
                        ))}
                      </Box.Flex>
                    </Box.Flex>
                  ))}
                </Box.Flex>
              </Box.Flex>
            </Card.Body>
          </Card>
          <Card css={{ backgroundColor: '$intentsSuccess2' }}>
            <Card.Body>
              <Box.Flex direction="column" gap="$10" css={{ flex: '1' }}>
                <Text color="brand" fontSize="3xl">
                  BETA-4
                </Text>
                <Box.Flex gap="$40">
                  <Box.Flex
                    gap="$10"
                    direction="column"
                    css={{ minWidth: 250, maxWidth: 250 }}
                  >
                    {stableRepos.map((repo: any) => (
                      <Box.Flex
                        direction="column"
                        key={repo.name + repo.version}
                      >
                        <Repo
                          name={repo.name}
                          version={repo.version}
                          isCorrect={repo.isCorrect}
                          isBig
                        />
                        <Box.Flex
                          direction="column"
                          css={{
                            alignSelf: 'flex-end',
                            '.fuel_Alert': {
                              py: '$1',
                              px: '$2',
                            },
                          }}
                        >
                          {repo.dependencies?.map((dependency: any) => (
                            <Repo
                              key={
                                dependency.name +
                                dependency.version +
                                dependency
                              }
                              name={dependency.name}
                              version={dependency.version}
                              isCorrect={dependency.isCorrect}
                            />
                          ))}
                        </Box.Flex>
                      </Box.Flex>
                    ))}
                  </Box.Flex>
                </Box.Flex>
              </Box.Flex>
            </Card.Body>
          </Card>
        </Box.Flex>
      </Layout.Content>
    </Layout>
  );
};
