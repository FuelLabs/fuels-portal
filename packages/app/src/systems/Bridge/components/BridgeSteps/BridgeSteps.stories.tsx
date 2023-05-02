import { cssObj } from '@fuel-ui/css';
import { Flex, Text } from '@fuel-ui/react';

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
      status: <Text fontSize="xs">Action</Text>,
      isLoading: false,
      isDone: false,
      isSelected: true,
    },
    {
      name: 'Settlement',
      status: <Text fontSize="xs">Wait ~15 min</Text>,
      isLoading: false,
      isDone: false,
      isSelected: false,
    },
    {
      name: 'Confirm transaction',
      status: <Text fontSize="xs">Action</Text>,
      isLoading: false,
      isDone: false,
      isSelected: false,
    },
    {
      name: 'Receive funds',
      status: <Text fontSize="xs">Automatic</Text>,
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

export const Mixed = () => {
  const steps = [
    {
      name: 'Submit to bridge',
      status: <Text fontSize="xs">Done!</Text>,
      isLoading: false,
      isDone: true,
      isSelected: false,
    },
    {
      name: 'Settlement',
      status: (
        <Text
          fontSize="xs"
          leftIcon="SpinnerGap"
          iconSize={10}
          css={{ gap: '$1' }}
        >
          ~5 minutes left
        </Text>
      ),
      isLoading: true,
      isDone: false,
      isSelected: true,
    },
    {
      name: 'Confirm transaction',
      status: <Text fontSize="xs">Action</Text>,
      isLoading: false,
      isDone: false,
      isSelected: false,
    },
    {
      name: 'Receive funds',
      status: <Text fontSize="xs">Automatic</Text>,
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
