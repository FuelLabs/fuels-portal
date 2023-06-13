import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import { BridgeTxListEmpty } from './BridgeTxListEmpty';

export default {
  component: BridgeTxListEmpty,
  title: 'BridgeTxListEmpty',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <BridgeTxListEmpty isConnecting={false} onClick={() => {}} />
    </Box.Flex>
  );
};

export const IsConnecting = () => {
  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <BridgeTxListEmpty isConnecting={true} onClick={() => {}} />
    </Box.Flex>
  );
};

export const HideConnectButton = () => {
  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <BridgeTxListEmpty
        isConnecting={false}
        onClick={() => {}}
        hideConnectButton={true}
      />
    </Box.Flex>
  );
};

const styles = {
  storybook: cssObj({
    margin: '20px',
    width: '100%',
  }),
};
