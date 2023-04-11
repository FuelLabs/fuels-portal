import { Button, Card } from '@fuel-ui/react';

type FuelInstallPopupProps = {
  open: boolean;
};

export const FuelInstallPopup = ({ open }: FuelInstallPopupProps) => {
  return (
    <>
      {open && (
        <Card align="center" css={{ background: 'White' }}>
          <Card.Header>Install Fuel Wallet</Card.Header>
          <Card.Body>
            <a
              href="https://wallet.fuel.network/docs/install/"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outlined">Install Fuel Wallet</Button>
            </a>
          </Card.Body>
        </Card>
      )}
    </>
  );
};
