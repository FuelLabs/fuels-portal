import { AccountSwitch } from '../AccountSwitch';

import { useConnectFuel, useDisconnectFuel } from '~/systems/Core/hooks';
import { useAccounts } from '~/systems/Core/hooks/useAccounts';

type FuelAccountSwitchProps = {
  open: boolean;
  onSelect: () => void;
};

export const FuelAccountSwitch = ({ open }: FuelAccountSwitchProps) => {
  const connectFuel = useConnectFuel();
  const disconnectFuel = useDisconnectFuel();
  const accounts = useAccounts();

  return (
    <AccountSwitch
      open={open}
      accounts={accounts.data || []}
      isLoading={accounts.isLoading}
      onSelect={() => {}}
      onConnect={() => connectFuel.mutate()}
      onDisconnect={() => disconnectFuel.mutate()}
    />
  );
};
