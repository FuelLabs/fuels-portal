import { useState } from 'react';

import { FuelInstallPopup } from '../FuelInstallPopup';
import { NetworkCard } from '../NetworkCard';

import { useConnectFuel, useFuel, useFuelWallet } from '~/systems/Core/hooks';

type FuelNetworkCardProps = {
  heading: string;
};

export const FuelNetworkCard = ({ heading }: FuelNetworkCardProps) => {
  const fuelWallet = useFuelWallet();
  const connectFuel = useConnectFuel();
  const fuel = useFuel();
  const [popupOpen, setPopupOpen] = useState(false);

  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  const onConnectFunc = fuel ? connectFuel.mutate : togglePopup;

  return (
    <>
      <NetworkCard
        network="Fuel"
        networkImageUrl="public/fuel-logo.svg"
        heading={heading}
        address={
          fuelWallet.data ? fuelWallet.data.address.toAddress() : undefined
        }
        isLoading={connectFuel.isLoading}
        onConnect={() => onConnectFunc()}
      />
      <FuelInstallPopup open={popupOpen} />
    </>
  );
};
