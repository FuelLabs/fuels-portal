import { useInterpret } from '@xstate/react';
import { bn } from 'fuels';

import { bridgeEthToFuelMachine } from '../machines';

export function useBridgeEthToFuel() {
  const service = useInterpret(bridgeEthToFuelMachine);

  const startBridging = () => {
    service.send('START_BRIDGING', {
      input: {
        ethAccount: '0xasdasdasddsa',
        fuelAccount: '0xasdasdadsads',
        asset: '0x0000',
        amount: bn(5),
      },
    });
  };

  return {
    handlers: {
      startBridging,
    },
  };
}
