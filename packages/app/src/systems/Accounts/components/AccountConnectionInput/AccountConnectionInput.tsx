import { cssObj } from '@fuel-ui/css';
import { Card, Text, Image, Button, Box, IconButton } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { coreStyles, shortAddress } from '~/systems/Core';

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
    <Card css={{ ...styles.root, ...coreStyles.card }}>
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
                size="sm"
                intent="primary"
                aria-label={`${label} Connect wallet`}
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
                size="sm"
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
    minHeight: '$15',
    borderRadius: '$md',
  }),
  cardBody: cssObj({
    px: '$3',
    py: '$2',
  }),
  connectButton: cssObj({
    borderRadius: '$md',
    height: '22px',
    width: '140px',
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
