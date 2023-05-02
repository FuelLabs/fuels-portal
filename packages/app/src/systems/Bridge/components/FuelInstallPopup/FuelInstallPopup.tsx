import { cssObj } from '@fuel-ui/css';
import { Button, Dialog } from '@fuel-ui/react';

type FuelInstallPopupProps = {
  open?: boolean;
};

export const FuelInstallPopup = ({ open }: FuelInstallPopupProps) => {
  return (
    <>
      {open && (
        <Dialog isOpen={open}>
          <Dialog.Content css={styles.content}>
            <Dialog.Heading css={styles.heading}>
              Install Fuel Wallet
            </Dialog.Heading>
            <Dialog.Description>
              <a
                href="https://wallet.fuel.network/docs/install/"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outlined">Install Fuel Wallet</Button>
              </a>
            </Dialog.Description>
          </Dialog.Content>
        </Dialog>
      )}
    </>
  );
};

const styles = {
  content: cssObj({
    background: '$intentsBase12',
    alignItems: 'center',
  }),
  heading: cssObj({
    color: '$intentsBase1',
  }),
};
