import { Card, Flex, Image, Button, Text, Stack } from '@fuel-ui/react';
import { Bech32Address } from 'fuels';

interface NetworkCardProps {
  network: string;
  networkImageUrl: string;
  heading: string;
  isLoading: boolean;
  onConnect: () => void;
  address?: `0x${string}` | Bech32Address;
}

export const NetworkCard = ({
  network,
  networkImageUrl,
  heading,
  isLoading,
  onConnect,
  address,
}: NetworkCardProps) => {
  return (
    <Card css={{ background: '$whiteA12' }}>
      <Card.Body>
        <Stack>
          <Text>{heading}</Text>
          <Flex justify="space-between">
            <Flex gap="$2">
              <Image width="20" height="20" src={networkImageUrl} />
              <Text color="blackA12">{network}</Text>
            </Flex>
            <Flex>
              {!address ? (
                <Button onPress={onConnect} isLoading={isLoading}>
                  Connect Wallet
                </Button>
              ) : (
                <Button onPress={onConnect} isLoading={isLoading}>
                  {address}
                </Button>
              )}
            </Flex>
          </Flex>
        </Stack>
      </Card.Body>
    </Card>
  );
};
