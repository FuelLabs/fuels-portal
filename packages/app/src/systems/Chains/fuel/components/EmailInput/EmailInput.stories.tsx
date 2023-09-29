import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import { EmailInput } from './EmailInput';

export default {
  component: EmailInput,
  title: 'EmailInput',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <EmailInput />
    </Box.Flex>
  );
};

const styles = {
  storybook: cssObj({
    margin: '20px',
  }),
};
