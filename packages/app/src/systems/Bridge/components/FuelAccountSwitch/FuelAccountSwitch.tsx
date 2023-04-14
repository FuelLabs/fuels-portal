import { AccountSwitch } from '../AccountSwitch';

import { useConnectFuel, useDisconnectFuel } from '~/systems/Core/hooks';
import { useAccounts } from '~/systems/Core/hooks/useAccounts';

type FuelAccountSwitchProps = {
  open: boolean;
  onSelect: () => void;
};

export const FuelAccountSwitch = ({ open }: FuelAccountSwitchProps) => {
  const accounts = useAccounts();
  const connectFuel = useConnectFuel();
  const disconnectFuel = useDisconnectFuel();

  return (
    <AccountSwitch
      open={open}
      accounts={accounts.data || []}
      onSelect={() => {}}
      onConnect={() => connectFuel.mutate()}
      onDisconnect={() => disconnectFuel.mutate()}
    />
  );
};
