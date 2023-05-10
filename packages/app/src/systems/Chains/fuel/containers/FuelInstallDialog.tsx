import { cssObj } from '@fuel-ui/css';
import { Button, Dialog, IconButton, Icon } from '@fuel-ui/react';

import { useFuelAccountConnection } from '../hooks';

export const FuelInstallDialog = () => {
  const { handlers } = useFuelAccountConnection();

  return (
    <>
      <Dialog.Heading css={styles.heading}>
        Install Fuel Wallet
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close unlock window"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description css={styles.description}>
        <a
          href="https://wallet.fuel.network/docs/install/"
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="outlined">Install Fuel Wallet</Button>
        </a>
      </Dialog.Description>
    </>
  );
};

const styles = {
  description: cssObj({
    display: 'flex',
    justifyContent: 'center',
  }),
  heading: cssObj({
    color: 'Black',
  }),
};
