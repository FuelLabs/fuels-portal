import { Text } from '@fuel-ui/react';

import { Bridge } from './Bridge';

import { Layout } from '~/systems/Core';

export const BridgeHome = () => {
  return (
    <Layout>
      <Layout.Content>
        <Text>Fuel Native Bridge</Text>
        {/* TODO: here should put tabs (Bridge) / (Transactions) */}
        <Bridge />
      </Layout.Content>
    </Layout>
  );
};
