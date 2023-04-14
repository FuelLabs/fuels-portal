import { cssObj } from '@fuel-ui/css';
import { Button, Dialog, Stack, Text } from '@fuel-ui/react';

import { formatAddress } from '~/systems/Core/utils';

type FuelAccountSwitchProps = {
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
}: FuelAccountSwitchProps) => {
  const accountsList = accounts.map((account) => {
    return (
      <Text onClick={() => onSelect(account)} color="blackA12" key={account}>
        {formatAddress(account)}
      </Text>
    );
  });

  return (
    <>
      {open && (
        <Dialog isOpen={open}>
          <Dialog.Content css={styles.content}>
            <Dialog.Close />
            <Dialog.Heading>
              <Stack>{accountsList}</Stack>
            </Dialog.Heading>
            <Dialog.Description>
              <Stack>
                <Button onPress={onConnect}>Connect Account</Button>
                <Button onPress={onDisconnect}>Disconnect Wallet</Button>
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
};
