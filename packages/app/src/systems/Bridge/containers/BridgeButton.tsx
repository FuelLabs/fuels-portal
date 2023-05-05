import { Button } from '@fuel-ui/react';

import { useBridgeButton } from '../hooks';

export const BridgeButton = () => {
  const { buttonText, handlers } = useBridgeButton();

  return <Button onPress={handlers.buttonAction}>{buttonText}</Button>;
};
