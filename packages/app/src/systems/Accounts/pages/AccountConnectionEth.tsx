import ethLogoSrc from '../../../../public/eth-logo.svg';
import { AccountConnectionInput } from '../components';
import { useAccountConnectionEth } from '../hooks';

export const AccountConnectionEth = () => {
  const { address, handlers } = useAccountConnectionEth();

  return (
    <AccountConnectionInput
      networkName={'Ethereum'}
      networkImageUrl={ethLogoSrc}
      label={'From'}
      onConnect={handlers.openAccountConnectionEth}
      onDisconnect={handlers.disconnect}
      currentAccount={address}
    />
  );
};
