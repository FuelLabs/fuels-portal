import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import { ActionBadge } from './ActionBadge';

export default {
  component: ActionBadge,
  title: 'ActionBadge',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <ActionBadge />
    </Box.Flex>
  );
};

const styles = {
  storybook: cssObj({
    margin: '20px',
  }),
};
