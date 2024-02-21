import { Alert, Link } from '@fuel-ui/react';

export function DeprecatedAlert() {
  return (
    <Alert
      status="warning"
      css={{
        maxWidth: '80rem',
        margin: '0 auto',
      }}
    >
      <Alert.Description>
        This app is compatible only with the beta-4 network and Fuel Wallet
        version 0.13.2. For newer versions access: &nbsp;
        <Link href="https://app.fuel.network" isExternal>
          https://app.fuel.network
        </Link>
        <br />
        <br />
        This app will be shutdown in on March 1st.
      </Alert.Description>
    </Alert>
  );
}
