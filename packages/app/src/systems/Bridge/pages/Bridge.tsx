import { Box, Flex } from '@fuel-ui/react';
import { Layout } from '~/systems/Core';
import { BridgeCard } from '../components/BridgeCard';

export const Bridge = () => {
  return (
    <Layout>
      <Flex></Flex>
      <Flex justify="center">
        <Box css={{ width: '640px' }}>
          <BridgeCard />
        </Box>
      </Flex>
      <Flex></Flex>
    </Layout>
  );
};
