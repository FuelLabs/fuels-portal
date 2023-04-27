import { cssObj } from '@fuel-ui/css';
import { Flex, Icon, Stack, Box, Text } from '@fuel-ui/react';

type Step = {
  name: string;
  status: string;
  isLoading: boolean;
  isDone: boolean;
  isSelected: boolean;
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
            key={index}
            align="center"
            justify="space-between"
            css={styles.item}
          >
            <Flex gap="$2">
              <Flex>
                <Icon
                  icon="Circle"
                  size={20}
                  color={step.isSelected ? 'accent9' : undefined}
                />
                <Box css={styles.number}>
                  <Text
                    fontSize="xs"
                    color={step.isSelected ? 'blackA12' : undefined}
                  >
                    {index + 1}
                  </Text>
                </Box>
              </Flex>
              <Text fontSize="xs" color="blackA12" css={styles.name}>
                {step.name}
              </Text>
            </Flex>
            <Text fontSize="xs">{step.status}</Text>
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
    py: '$2',

    '& ~ &': {
      borderTop: '1px solid $gray11',
    },
  }),
  name: cssObj({ lineHeight: '1.5rem' }),
  number: cssObj({
    marginLeft: '-14px',
    marginTop: '4px',
  }),
};
