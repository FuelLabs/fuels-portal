import { cssObj } from '@fuel-ui/css';
import { Flex } from '@fuel-ui/react';

import { BridgeSteps } from './BridgeSteps';

export default {
  component: BridgeSteps,
  title: 'BridgeSteps',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  const steps = [
    {
      name: 'Submit to bridge',
      status: 'Action',
      isLoading: false,
      isDone: false,
      isSelected: true,
    },
    {
      name: 'Settlement',
      status: 'Wait ~15 min',
      isLoading: false,
      isDone: false,
      isSelected: false,
    },
    {
      name: 'Confirm transaction',
      status: 'Action',
      isLoading: false,
      isDone: false,
      isSelected: false,
    },
    {
      name: 'Receive funds',
      status: 'Automatic',
      isLoading: false,
      isDone: false,
      isSelected: false,
    },
  ];
  return (
    <Flex align="center" justify="center" css={styles.storybook}>
      <BridgeSteps steps={steps} />
    </Flex>
  );
};

const styles = {
  storybook: cssObj({
    margin: '20px',
  }),
};
