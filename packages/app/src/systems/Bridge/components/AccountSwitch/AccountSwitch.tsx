import { cssObj } from '@fuel-ui/css';
import {
  Button,
  Dialog,
  Stack,
  Text,
  Flex,
  Copyable,
  Avatar,
  List,
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
      <Dialog.Close />
      <Dialog.Description css={styles.description}>
        <List>
          {accounts.map((account) => {
            return (
              <List.Item
                key={account}
                onClick={() => onSelect && onSelect(account)}
                css={
                  onSelect
                    ? { ...styles.select, ...styles.listItem }
                    : styles.listItem
                }
              >
                <Flex align="center" gap="$3">
                  <Avatar.Generated
                    size={'xsm'}
                    background="fuel"
                    hash={account}
                  />
                  <Text color="gray12">{shortAddress(account)}</Text>
                  <Copyable value={account} />
                </Flex>
              </List.Item>
            );
          })}
        </List>
      </Dialog.Description>
      <Dialog.Footer css={styles.footer}>
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
      </Dialog.Footer>
    </>
  );
};

const styles = {
  stack: cssObj({
    width: '100%',
  }),
  listItem: cssObj({
    paddingBottom: '$1',
    '& ~ & ': {
      pt: '$2',
      borderTop: '1px dashed $gray3',
    },
  }),
  description: cssObj({
    paddingLeft: '$8',
    paddingRight: '$8',
    paddingTop: '$8',
  }),
  button: cssObj({
    borderRadius: '$md',
    backgroundColor: '$gray6',
    color: '$gray12',
  }),
  select: cssObj({
    '&:hover': { backgroundColor: '$gray6' },
    cursor: 'pointer',
  }),
  footer: cssObj({
    paddingLeft: '$8',
    paddingRight: '$8',
    paddingBottom: '$8',
    justifyContent: 'center',
  }),
};
