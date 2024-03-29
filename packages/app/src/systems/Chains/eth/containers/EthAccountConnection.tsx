import { AccountConnectionInput } from '~/systems/Accounts';
import { useAsset } from '~/systems/Assets';

import { ETH_CHAIN } from '../../config';
import { useEthAccountConnection } from '../hooks';

export const EthAccountConnection = ({ label }: { label?: string }) => {
  const { asset: ethAsset } = useAsset();
  const { address, ens, handlers, isConnecting } = useEthAccountConnection();

  return (
    <AccountConnectionInput
      networkName={ETH_CHAIN.name}
      networkImage={ethAsset?.icon}
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
