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
  IconButton,
} from '@fuel-ui/react';

import { shortAddress } from '~/systems/Core/utils';

type AccountConnectionInputProps = {
  networkName: string;
  networkImageUrl: string;
  label: string;
  isConnecting?: boolean;
  currentAccount?: string;
  onConnect: () => void;
  onDisconnect?: () => void;
};

export const AccountConnectionInput = ({
  networkName,
  networkImageUrl,
  label,
  isConnecting,
  currentAccount,
  onConnect,
  onDisconnect,
}: AccountConnectionInputProps) => {
  return (
    <Card css={styles.root}>
      <Card.Body css={styles.body}>
        <Stack gap="$1">
          <Box>
            <Text fontSize="sm">{label}</Text>
          </Box>
          <Flex align="center" wrap="wrap" justify="space-between">
            <Flex gap="$2" align="center">
              <Image width="20" height="20" src={networkImageUrl} />
              <Text>{networkName}</Text>
            </Flex>
            <Flex>
              {!currentAccount ? (
                <Button
                  onPress={onConnect}
                  isLoading={isConnecting}
                  css={styles.connectButton}
                >
                  Connect wallet
                </Button>
              ) : (
                <Button
                  isLoading={isConnecting}
                  leftIcon={<Icon icon="Circle" color="red10" fill="red10" />}
                  rightIcon={
                    <IconButton
                      icon="X"
                      variant="link"
                      color="gray"
                      onPress={onDisconnect}
                      aria-label="Disconnect account"
                    />
                  }
                  variant="outlined"
                  color="gray"
                  css={styles.connectButton}
                >
                  {shortAddress(currentAccount)}
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
    minWidth: '350px',
    minHeight: '60px',
    borderRadius: '$md',
  }),
  body: cssObj({
    padding: '10px',
  }),
  connectButton: cssObj({
    borderRadius: '$md',
    height: '22px',
    width: '140px',
    fontSize: '$xs',
  }),
};
