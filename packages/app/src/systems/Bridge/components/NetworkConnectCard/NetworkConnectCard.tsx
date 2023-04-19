import { cssObj } from '@fuel-ui/css';
import {
  Card,
  Stack,
  Text,
  Flex,
  Image,
  Button,
  Icon,
  Box,
} from '@fuel-ui/react';
import type { Bech32Address } from 'fuels';

import { formatAddress } from '~/systems/Core/utils';

type NetworkConnectCardProps = {
  networkName: string;
  networkImageUrl: string;
  label: string;
  isConnecting: boolean;
  currentAccount?: `0x${string}` | Bech32Address;
  accounts?: `0x${string}`[] | Bech32Address[];
  onConnect: () => void;
};

export const NetworkConnectCard = ({
  networkName,
  networkImageUrl,
  label,
  isConnecting,
  currentAccount,
  onConnect,
}: NetworkConnectCardProps) => {
  return (
    <Card css={styles.root}>
      <Card.Body css={styles.body}>
        <Stack gap="$1" css={styles.stack}>
          <Box>
            <Text fontSize="sm">{label}</Text>
          </Box>
          <Flex align="center" wrap="wrap" justify="space-between">
            <Flex gap="$2" align="center">
              <Image width="20" height="20" src={networkImageUrl} />
              <Text color="blackA12">{networkName}</Text>
            </Flex>
            <Flex>
              {!currentAccount ? (
                <Button
                  onPress={onConnect}
                  isLoading={isConnecting}
                  css={styles.buttonRoot}
                >
                  Connect wallet
                </Button>
              ) : (
                <Button
                  onPress={onConnect}
                  isLoading={isConnecting}
                  leftIcon={<Icon icon="Circle" color="red10" fill="red10" />}
                  rightIcon="CaretDown"
                  variant="outlined"
                  css={{ ...styles.buttonRoot, ...styles.accountButton }}
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
    minWidth: '350px',
    minHeight: '60px',
    boxShadow: '$none',
    borderColor: '$gray12',
    borderRadius: '$md',
  }),
  stack: cssObj({
    width: '100%',
  }),
  body: cssObj({
    padding: '10px',
  }),
  buttonRoot: cssObj({
    borderRadius: '$md',
    height: '22px',
    width: '140px',
    fontSize: '$xs',
  }),
  accountButton: cssObj({
    color: '$blackA12',
    borderColor: '$gray11',
  }),
};
