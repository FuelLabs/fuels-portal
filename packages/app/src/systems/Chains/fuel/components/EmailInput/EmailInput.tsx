import { Box, Button, Input, Text } from '@fuel-ui/react';

export const EmailInput = () => {
  return (
    <Box.Stack>
      <Text>Get notified when it settles</Text>
      <Box.Flex align="center" justify="space-between">
        <Input>
          <Input.Field type="email" placeholder="Your email address" />
        </Input>
        <Button>Notify me</Button>
      </Box.Flex>
    </Box.Stack>
  );
};
