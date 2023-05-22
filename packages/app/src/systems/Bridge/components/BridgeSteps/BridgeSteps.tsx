import { cssObj } from '@fuel-ui/css';
import { Spinner, Box, Text, Icon } from '@fuel-ui/react';
import type { ReactNode } from 'react';

type Step = {
  name: ReactNode;
  status: ReactNode;
  isLoading?: boolean;
  isDone?: boolean;
  isSelected?: boolean;
};

type BridgeStepsProps = {
  steps?: Step[];
};

export const BridgeSteps = ({ steps }: BridgeStepsProps) => {
  return (
    <Box.Stack css={styles.stack}>
      {steps?.map((step, index) => {
        return (
          <Box.Flex key={`${index}_${step.name?.toString()}`} css={styles.item}>
            <Box.Flex css={styles.action}>
              <Box
                css={{
                  ...styles.circle,
                  borderColor: step.isSelected ? '$intentsPrimary9' : undefined,
                }}
                className={step.isDone ? 'circleDone' : undefined}
              >
                {step.isDone ? (
                  <Icon icon="Check" size={10} css={styles.icon} />
                ) : (
                  <Text
                    color={step.isSelected ? 'intentsBase12' : undefined}
                    css={styles.number}
                    fontSize="xs"
                  >
                    {index + 1}
                  </Text>
                )}
              </Box>

              <Text css={styles.name}>{step.name}</Text>
            </Box.Flex>
            <Box.Flex align="center" gap="$1">
              {step.isLoading && <Spinner size={14} />}
              <Text fontSize="sm">{step.status}</Text>
            </Box.Flex>
          </Box.Flex>
        );
      })}
    </Box.Stack>
  );
};

const styles = {
  stack: cssObj({
    gap: '$0',
    minWidth: '344px',
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
  action: cssObj({
    gap: '$2',
    alignItems: 'center',
  }),
  name: cssObj({
    lineHeight: '1.5rem',
    fontSize: '$xs',
    color: '$intentsBase12',
  }),
  icon: cssObj({
    color: '$intentsBase12',
  }),
  number: cssObj({
    display: 'flex',
    justifyContent: 'center',
    fontSize: '10px',
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
