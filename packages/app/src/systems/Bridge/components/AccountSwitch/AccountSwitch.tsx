import { cssObj } from '@fuel-ui/css';
import {
  Button,
  Dialog,
  Stack,
  Text,
  Flex,
  Copyable,
  Avatar,
} from '@fuel-ui/react';

import { shortAddress } from '~/systems/Core/utils';

type AccountSwitchProps = {
  accounts: string[];
  onSelect?: (val: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export const AccountSwitch = ({
  accounts,
  onSelect,
  onConnect,
  onDisconnect,
}: AccountSwitchProps) => {
  return (
    <>
      <Dialog.Heading css={styles.heading}>
        <Stack>
          {accounts.map((account) => {
            return (
              <Flex
                align="center"
                gap="$1"
                key={account}
                css={onSelect && styles.hover}
              >
                <Avatar.Generated
                  size={'xsm'}
                  background="fuel"
                  hash={account}
                />
                <Text
                  onClick={() => onSelect && onSelect(account)}
                  color="blackA12"
                  css={onSelect && styles.pointer}
                >
                  {shortAddress(account)}
                </Text>
                <Copyable value={account} />
              </Flex>
            );
          })}
        </Stack>
      </Dialog.Heading>
      <Dialog.Description>
        <Stack css={styles.stack}>
          {onConnect && (
            <Button onPress={onConnect} css={styles.button}>
              Connect Account
            </Button>
          )}
          {onDisconnect && (
            <Button onPress={onDisconnect} css={styles.button}>
              Disconnect Wallet
            </Button>
          )}
        </Stack>
      </Dialog.Description>
    </>
  );
};

const styles = {
  content: cssObj({
    background: '$white',
  }),
  stack: cssObj({
    marginBottom: '$5',
  }),
  heading: cssObj({
    borderColor: '$gray12',
  }),
  button: cssObj({
    borderRadius: '$md',
    backgroundColor: '$gray12',
  }),
  hover: cssObj({
    ':hover': { backgroundColor: '$gray12' },
  }),
  pointer: cssObj({
    cursor: 'pointer',
  }),
};
