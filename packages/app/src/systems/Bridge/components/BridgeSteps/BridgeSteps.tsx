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
    <Stack css={styles.stack}>
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
              <Text color="blackA12">{step.name}</Text>
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
    px: '$4',
    py: '$2',
  }),
  item: cssObj({
    '& ~ &': {
      borderTop: '1px solid $gray11',
      paddingTop: '$2',
    },
  }),
  number: cssObj({
    marginLeft: '-13px',
    marginTop: '4px',
  }),
};
