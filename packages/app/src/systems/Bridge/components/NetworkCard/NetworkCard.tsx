import { cssObj } from '@fuel-ui/css';
import { Card, Flex, Stack, Text, Image, Button } from '@fuel-ui/react';
import type { Bech32Address } from 'fuels';

import { formatAddress } from '~/systems/Core/utils/address';

type NetworkCardProps = {
  network: string;
  networkImageUrl: string;
  heading: string;
  isLoading: boolean;
  onConnect: () => void;
  address?: `0x${string}` | Bech32Address;
};

export const NetworkCard = ({
  network,
  networkImageUrl,
  heading,
  isLoading,
  onConnect,
  address,
}: NetworkCardProps) => {
  const buttonText = !address ? 'Connect Wallet' : formatAddress(address);

  return (
    <Card css={styles.root}>
      <Card.Body>
        <Stack>
          <Text>{heading}</Text>
          <Flex gap="$2">
            <Image width="20" height="20" src={networkImageUrl} />
            <Text color="blackA12">{network}</Text>
          </Flex>
          <Flex>
            <Button onPress={onConnect} isLoading={isLoading}>
              {buttonText}
            </Button>
          </Flex>
        </Stack>
      </Card.Body>
    </Card>
  );
};

const styles = {
  root: cssObj({
    background: '$whiteA12',
  }),
};
