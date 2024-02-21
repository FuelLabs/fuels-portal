import { Alert, Link } from '@fuel-ui/react';

export function DeprecatedAlert() {
  return (
    <Alert
      status="warning"
      css={{
        justifyContent: 'center',
        '.fuel_Alert-content': {
          flex: '0 0 auto',
        },
      }}
    >
      <Alert.Description>
        This Portal website is not functional anymore and will be shut down
        completely soon.
        <br />
        <br />
        Check the new version of Fuel Portal here: &nbsp;
        <Link href="https://app.fuel.network" isExternal>
          https://app.fuel.network
        </Link>
      </Alert.Description>
    </Alert>
  );
}
