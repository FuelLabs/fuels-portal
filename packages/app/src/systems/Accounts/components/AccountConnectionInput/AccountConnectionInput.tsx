import { cssObj } from '@fuel-ui/css';
import { Card, Text, Image, Button, Box, IconButton } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { shortAddress } from '~/systems/Core';

type AccountConnectionInputProps = {
  networkName?: string;
  networkImage: ReactNode | string;
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
  networkImage,
  label,
  isConnecting,
  account,
  onConnect,
  onDisconnect,
}: AccountConnectionInputProps) => {
  return (
    <Card css={styles.root}>
      <Card.Body css={styles.cardBody}>
        <Box.Stack gap="$1">
          <Box>
            <Text fontSize="sm">{label}</Text>
          </Box>
          <Box.Flex align="center" wrap="wrap" justify="space-between">
            <Box.Flex gap="$2" align="center">
              {typeof networkImage === 'string' ? (
                <Image width="20" height="20" src={networkImage} />
              ) : (
                networkImage
              )}
              <Text color="intentsBase12">{networkName}</Text>
            </Box.Flex>
            {!account?.address ? (
              <Button
                onPress={onConnect}
                isLoading={isConnecting}
                css={styles.connectButton}
                size="xs"
                intent="primary"
                aria-label={`${label} Connect wallet`}
              >
                <Text fontSize="sm" color="inherit">
                  Connect wallet
                </Text>
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
                  />
                }
                variant="outlined"
                intent="base"
                size="xs"
                css={{ ...styles.connectedButton }}
              >
                <Text fontSize="sm">
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
    minHeight: '$15',
    overflowX: 'hidden',
  }),
  cardBody: cssObj({
    px: '$3',
    py: '$2',
  }),
  connectedButton: cssObj({
    justifyContent: 'space-between',
    gap: '$1',
  }),
  circle: cssObj({
    minWidth: '$3',
    height: '$3',
    backgroundColor: '$intentsError9',
    borderRadius: '$full',
  }),
  disconnectButton: cssObj({
    // p: '$0',
  }),
};
