import { useInterpret } from '@xstate/react';
import type { ReactNode } from 'react';
import { createContext, useEffect } from 'react';

import { useFuel } from '../Core/hooks';

import type {
  AccountMachineContext,
  AccountMachineService,
} from './machines/accountMachine';
import { accountMachine } from './machines/accountMachine';

const accountServiceContext = createContext<AccountMachineService>(
  // @ts-ignore
  null as AccountMachineService
);

type AccountProviderProps = {
  children: ReactNode;
};

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const fuel = useFuel();

  const accountService = useInterpret(accountMachine, {
    context: {
      fuel,
    } as AccountMachineContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  useEffect(() => {
    if (!fuel) return;
    accountService.send({
      type: 'INITIALIZE_FUEL',
      data: {
        fuel,
      },
    });
  }, [fuel]);

  return (
    <accountServiceContext.Provider value={accountService}>
      {children}
    </accountServiceContext.Provider>
  );
};
