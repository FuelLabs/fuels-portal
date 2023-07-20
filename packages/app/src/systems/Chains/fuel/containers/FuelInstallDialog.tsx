import { Box, Button, Dialog, FuelLogo, Text } from '@fuel-ui/react';

export const FuelInstallDialog = () => (
  <>
    <Dialog.Close />
    <Dialog.Heading>Get Wallet</Dialog.Heading>
    <Dialog.Description>
      <Box.Stack gap="$4">
        <Box.Flex align="center" gap="$2">
          <Text fontSize="lg" color="intentsBase12">
            Start Exploring Fuel
          </Text>
          <FuelLogo size={24} />
        </Box.Flex>
        <Text>
          Your wallet is the gateway to the Fuel Network, the magical technology
          that helps making modular blockchains possible.
        </Text>
      </Box.Stack>
    </Dialog.Description>
    <Dialog.Footer>
      <a href="https://wallet.fuel.network" target="_blank" rel="noreferrer">
        <Button intent="primary">Get Fuel Wallet</Button>
      </a>
    </Dialog.Footer>
  </>
);
