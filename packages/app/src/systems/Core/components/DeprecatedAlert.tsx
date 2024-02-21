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
        This Portal website is not functional anymore.
        <br />
        It has been migrated to:&nbsp;
        <Link href="https://app.fuel.network" isExternal>
          https://app.fuel.network
        </Link>
      </Alert.Description>
    </Alert>
  );
}
