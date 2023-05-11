import { cssObj } from '@fuel-ui/css';
import { Card, Text, Image, Button, Box, IconButton } from '@fuel-ui/react';

import { shortAddress } from '~/systems/Core/utils';

type AccountConnectionInputProps = {
  networkName?: string;
  networkImageUrl: string;
  label?: string;
  isConnecting?: boolean;
  account?: {
    address?: string;
    alias?: string;
    avatar?: string;
  };
  onConnect: () => void;
  onDisconnect?: () => void;
};

export const AccountConnectionInput = ({
  networkName,
  networkImageUrl,
  label,
  isConnecting,
  account,
  onConnect,
  onDisconnect,
}: AccountConnectionInputProps) => {
  return (
    <Card css={styles.root}>
      <Card.Body>
        <Box.Stack gap="$1">
          <Box>
            <Text css={styles.label}>{label}</Text>
          </Box>
          <Box.Flex align="center" wrap="wrap" justify="space-between">
            <Box.Flex gap="$2" align="center">
              <Image width="20" height="20" src={networkImageUrl} />
              <Text>{networkName}</Text>
            </Box.Flex>
            {!account?.address ? (
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
                leftIcon={<Box css={styles.circle}>&nbsp;</Box>}
                rightIcon={
                  <IconButton
                    icon="X"
                    variant="link"
                    intent="base"
                    onPress={onDisconnect}
                    aria-label="Disconnect account"
                    iconSize={12}
                    css={styles.disconnectButton}
                  />
                }
                variant="outlined"
                intent="base"
                size="xs"
                css={{ ...styles.connectButton, ...styles.connectedButton }}
              >
                <Text fontSize="xs">
                  {shortAddress(account.alias, 16) ||
                    shortAddress(account.address)}
                </Text>
              </Button>
            )}
          </Box.Flex>
        </Box.Stack>
      </Card.Body>
    </Card>
  );
};

const styles = {
  root: cssObj({
    py: '$2',
    px: '$3',
    minHeight: '$15',
    borderRadius: '$md',
  }),
  label: cssObj({
    fontSize: '$sm',
  }),
  connectButton: cssObj({
    borderRadius: '$md',
    height: '22px',
    width: '140px',
    fontSize: '$xs',
  }),
  connectedButton: cssObj({
    justifyContent: 'space-between',
    gap: 0,
  }),
  circle: cssObj({
    minWidth: 10,
    height: 10,
    backgroundColor: '$intentsError9',
    borderRadius: '$full',
  }),
  disconnectButton: cssObj({
    p: '$0',
  }),
};
