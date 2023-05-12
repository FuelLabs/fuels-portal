import { ETH_CHAIN } from '../../config';
import { useEthAccountConnection } from '../hooks';
import { ethLogoSrc } from '../utils';

import { AccountConnectionInput } from '~/systems/Accounts';

export const EthAccountConnection = ({ label }: { label?: string }) => {
  const { address, ens, handlers, isConnecting } = useEthAccountConnection();

  return (
    <AccountConnectionInput
      networkName={ETH_CHAIN.name}
      networkImageUrl={ethLogoSrc}
      label={label}
      onConnect={handlers.connect}
      onDisconnect={handlers.disconnect}
      isConnecting={isConnecting}
      account={{
        address,
        alias: ens?.name,
        avatar: ens?.avatar,
      }}
    />
  );
};
