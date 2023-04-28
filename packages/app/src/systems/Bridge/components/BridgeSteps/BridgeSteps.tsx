import { cssObj } from '@fuel-ui/css';
import { Flex, Stack, Box, Text } from '@fuel-ui/react';
import type { ReactNode } from 'react';

type Step = {
  name: ReactNode;
  status: ReactNode;
  isLoading?: boolean;
  isDone?: boolean;
  isSelected?: boolean;
};

type BridgeStepsProps = {
  steps: Step[];
};

export const BridgeSteps = ({ steps }: BridgeStepsProps) => {
  return (
    <Stack gap={0} css={styles.stack}>
      {steps.map((step, index) => {
        return (
          <Flex
            key={`${index}_${step.name?.toString()}`}
            align="center"
            justify="space-between"
            css={styles.item}
          >
            <Flex gap="$2" align="center">
              <Box
                css={{
                  ...styles.circle,
                  borderColor: step.isSelected ? '$accent9' : undefined,
                }}
              >
                <Text
                  color={step.isSelected ? 'blackA12' : undefined}
                  css={styles.number}
                >
                  {index + 1}
                </Text>
              </Box>
              <Text fontSize="xs" color="blackA12" css={styles.name}>
                {step.name}
              </Text>
            </Flex>
            {step.status}
          </Flex>
        );
      })}
    </Stack>
  );
};

const styles = {
  stack: cssObj({
    width: '344px',
    backgroundColor: '$whiteA12',
    borderRadius: '$md',
    border: '1px solid $gray11',
  }),
  item: cssObj({
    px: '$3',
    py: '$1',

    '& ~ &': {
      borderTop: '1px solid $gray11',
    },
  }),
  name: cssObj({ lineHeight: '1.5rem' }),
  number: cssObj({
    display: 'flex',
    justifyContent: 'center',
    fontSize: '8px',
  }),
  circle: cssObj({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    height: 20,
    border: '1px solid',
    borderColor: '$gray11',
    borderRadius: '$full',
  }),
};
