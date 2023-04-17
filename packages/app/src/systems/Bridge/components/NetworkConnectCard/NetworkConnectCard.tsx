import { cssObj } from '@fuel-ui/css';
import { Card, Stack, Text, Flex, Image, Button, Icon } from '@fuel-ui/react';
import type { Bech32Address } from 'fuels';

import { formatAddress } from '~/systems/Core/utils';

type NetworkConnectCardProps = {
  networkName: string;
  networkImageUrl: string;
  heading: string;
  isConnecting: boolean;
  currentAccount?: `0x${string}` | Bech32Address;
  accounts?: `0x${string}`[] | Bech32Address[];
  onConnect: () => void;
};

export const NetworkConnectCard = ({
  networkName,
  networkImageUrl,
  heading,
  isConnecting,
  currentAccount,
  onConnect,
}: NetworkConnectCardProps) => {
  return (
    <Card css={styles.root}>
      <Card.Body>
        <Stack>
          <Text>{heading}</Text>
          <Flex justify="space-between">
            <Flex gap="$2">
              <Image width="20" height="20" src={networkImageUrl} />
              <Text color="blackA12">{networkName}</Text>
            </Flex>
            <Flex>
              {!currentAccount ? (
                <Button
                  onPress={onConnect}
                  isLoading={isConnecting}
                  css={styles.button}
                >
                  Connect Wallet
                </Button>
              ) : (
                <Button
                  onPress={onConnect}
                  isLoading={isConnecting}
                  leftIcon={<Icon icon="Circle" color="red10" fill="red10" />}
                  rightIcon="CaretDown"
                  variant="outlined"
                  css={styles.accountButton}
                >
                  {formatAddress(currentAccount)}
                </Button>
              )}
            </Flex>
          </Flex>
        </Stack>
      </Card.Body>
    </Card>
  );
};

const styles = {
  root: cssObj({
    background: '$whiteA12',
    minWidth: '$2xl',
  }),
  button: cssObj({
    borderRadius: '$xl',
  }),
  accountButton: cssObj({
    borderRadius: '$xl',
    color: '$blackA12',
    borderColor: '$gray11',
  }),
};
