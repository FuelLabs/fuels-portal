import { cssObj } from '@fuel-ui/css';
import {
  Button,
  Dialog,
  Stack,
  Text,
  Flex,
  Image,
  Copyable,
} from '@fuel-ui/react';

import { formatAddress } from '~/systems/Core/utils';

type AccountSwitchProps = {
  open: boolean;
  accounts: string[];
  onSelect: (val: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
};

export const AccountSwitch = ({
  open,
  accounts,
  onSelect,
  onConnect,
  onDisconnect,
}: AccountSwitchProps) => {
  const accountsList = accounts.map((account) => {
    return (
      <Flex align="center" gap="$1" key={account}>
        <Image src="" width="30px" height="30px" />
        <Text onClick={() => onSelect(account)} color="blackA12">
          {formatAddress(account)}
        </Text>
        <Copyable value={account} />
      </Flex>
    );
  });

  return (
    <>
      {open && (
        <Dialog isOpen={open}>
          <Dialog.Content css={styles.content}>
            <Dialog.Close />
            <Dialog.Heading css={styles.heading}>
              <Stack>{accountsList}</Stack>
            </Dialog.Heading>
            <Dialog.Description>
              <Stack css={styles.stack}>
                <Button onPress={onConnect} css={styles.button}>
                  Connect Account
                </Button>
                <Button onPress={onDisconnect} css={styles.button}>
                  Disconnect Wallet
                </Button>
              </Stack>
            </Dialog.Description>
          </Dialog.Content>
        </Dialog>
      )}
    </>
  );
};

const styles = {
  content: cssObj({
    background: 'White',
  }),
  stack: cssObj({
    marginBottom: '20px',
  }),
  heading: cssObj({
    borderColor: '$gray12',
  }),
  button: cssObj({
    borderRadius: '$md',
    backgroundColor: '$gray12',
  }),
};
