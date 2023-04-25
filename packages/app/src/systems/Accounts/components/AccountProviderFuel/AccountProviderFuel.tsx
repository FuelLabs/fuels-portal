import { useInterpret } from '@xstate/react';
import type { ReactNode } from 'react';
import { useContext, createContext, useEffect } from 'react';

import { useFuel } from '../../hooks/useFuel';
import { accountMachine } from '../../machines';
import type {
  AccountMachineService,
  AccountMachineContext,
} from '../../machines';

const accountServiceContext = createContext<AccountMachineService>(
  // @ts-ignore
  null as AccountMachineService
);

type AccountProviderFuelProps = {
  children: ReactNode;
};

export const useAccountFuelService = () => useContext(accountServiceContext);

export const AccountProviderFuel = ({ children }: AccountProviderFuelProps) => {
  const fuel = useFuel();
  const service = useInterpret(accountMachine, {
    context: {
      fuel,
    } as AccountMachineContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  useEffect(() => {
    if (fuel) {
      service.send({
        type: 'WALLET_DETECTED',
        value: fuel,
      });
    }
  }, [fuel]);

  return (
    <accountServiceContext.Provider value={service}>
      {children}
    </accountServiceContext.Provider>
  );
};
