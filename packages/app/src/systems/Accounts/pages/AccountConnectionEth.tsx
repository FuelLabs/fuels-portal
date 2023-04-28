import { ConnectKitButton } from 'connectkit';

import ethLogoSrc from '../../../../public/eth-logo.svg';
import { AccountConnectionInput } from '../components';
import { useAccountConnectionEth } from '../hooks';

export const AccountConnectionEth = () => {
  const { address, ens, handlers } = useAccountConnectionEth();

  return (
    <ConnectKitButton.Custom>
      {({ show }) => (
        <AccountConnectionInput
          networkName={'Ethereum'}
          networkImageUrl={ethLogoSrc}
          label={'From'}
          onConnect={() => show?.()}
          onDisconnect={handlers.disconnect}
          account={{
            address,
            alias: ens?.name,
            avatar: ens?.avatar,
          }}
        />
      )}
    </ConnectKitButton.Custom>
  );
};
