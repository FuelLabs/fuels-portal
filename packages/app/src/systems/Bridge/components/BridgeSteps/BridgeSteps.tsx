import { cssObj } from '@fuel-ui/css';
import { Box, Text, Icon } from '@fuel-ui/react';
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
    <Box.Stack gap={0} css={styles.stack}>
      {steps.map((step, index) => {
        return (
          <Box.Flex key={`${index}_${step.name?.toString()}`} css={styles.item}>
            <Box.Flex gap="$2" align="center">
              <Box
                css={{
                  ...styles.circle,
                  borderColor: step.isSelected ? '$intentsPrimary9' : undefined,
                }}
                className={step.isDone ? 'circleDone' : undefined}
              >
                {step.isDone ? (
                  <Icon icon="Check" color="intentsBase12" size={10} />
                ) : (
                  <Text
                    color={step.isSelected ? 'intentsBase12' : undefined}
                    css={styles.number}
                  >
                    {index + 1}
                  </Text>
                )}
              </Box>

              <Text css={styles.name}>{step.name}</Text>
            </Box.Flex>
            {step.status}
          </Box.Flex>
        );
      })}
    </Box.Stack>
  );
};

const styles = {
  stack: cssObj({
    width: '344px',
    backgroundColor: '$intentsBase0',
    borderRadius: '$md',
    border: '1px solid $intentsBase5',
  }),
  item: cssObj({
    alignItems: 'center',
    justifyContent: 'space-between',
    px: '$3',
    py: '$1',

    '& ~ &': {
      borderTop: '1px solid $intentsBase5',
    },

    '.circleDone': {
      backgroundColor: '$intentsPrimary9',
      border: '1px solid $intentsPrimary9',
    },
  }),
  name: cssObj({
    lineHeight: '1.5rem',
    fontSize: '$xs',
    color: '$intentsBase12',
  }),
  number: cssObj({
    display: 'flex',
    justifyContent: 'center',
    fontSize: '8px',
  }),
  circle: cssObj({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '$4',
    height: '$4',
    border: '1px solid $intentsBase5',
    borderRadius: '$full',
  }),
};
