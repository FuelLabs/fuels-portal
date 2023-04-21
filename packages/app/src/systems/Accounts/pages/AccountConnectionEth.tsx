import ethLogoSrc from '../../../../public/eth-logo.svg';
import { AccountConnectionInput } from '../components';
import { useAccountConnectionEth } from '../hooks';

export const AccountConnectionEth = () => {
  const { address, handlers, isConnecting } = useAccountConnectionEth();

  return (
    <AccountConnectionInput
      networkName={'Ethereum'}
      networkImageUrl={ethLogoSrc}
      label={'From'}
      isConnecting={isConnecting}
      onConnect={handlers.openAccountConnectionEth}
      onDisconnect={handlers.disconnect}
      currentAccount={address}
    />
  );
};
