import { NetworkCard } from '../NetworkCard';

import { useConnectFuel, useFuelWallet } from '~/systems/Core/hooks';

type FuelNetworkCardProps = {
  heading: string;
};

export const FuelNetworkCard = ({ heading }: FuelNetworkCardProps) => {
  const fuelWallet = useFuelWallet();
  const connectFuel = useConnectFuel();

  return (
    <NetworkCard
      network="Fuel"
      networkImageUrl="public/fuel-logo.svg"
      heading={heading}
      address={
        fuelWallet.data ? fuelWallet.data.address.toAddress() : undefined
      }
      isLoading={connectFuel.isLoading}
      onConnect={() => connectFuel.mutate()}
    />
  );
};
