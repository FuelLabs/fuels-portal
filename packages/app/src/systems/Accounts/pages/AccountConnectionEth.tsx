import { useMemo } from 'react';

import ethLogoSrc from '../../../../public/eth-logo.svg';
import { AccountConnectionInput } from '../components';
import { useAccountConnectionEth } from '../hooks';

import { useBridge } from '~/systems/Bridge/hooks';
import { isEthChain } from '~/systems/Bridge/utils';

export const AccountConnectionEth = () => {
  const { address, ens, handlers, isConnecting } = useAccountConnectionEth();
  const { fromNetwork, toNetwork } = useBridge();

  const ethNetwork = useMemo(() => {
    if (isEthChain(fromNetwork)) {
      return {
        label: 'From',
        name: fromNetwork?.name,
      };
    }

    if (isEthChain(toNetwork)) {
      return {
        label: 'To',
        name: toNetwork?.name,
      };
    }

    return undefined;
  }, [fromNetwork, toNetwork]);

  return (
    <AccountConnectionInput
      networkName={ethNetwork?.name}
      networkImageUrl={ethLogoSrc}
      label={ethNetwork?.label}
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
