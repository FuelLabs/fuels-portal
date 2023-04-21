import { Dialog } from '@fuel-ui/react';

import { AccountSwitchDialog } from './AccountSwitchDialog';

export default {
  component: AccountSwitchDialog,
  title: 'AccountSwitchDialog',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  return (
    <Dialog isOpen>
      {/* <Dialog.Content> */}
      <AccountSwitchDialog
        accounts={[
          'fuel17kx8dy6gvugrppnkvsezyyh2qxusq57mvk2hueaa9smer220knuslpsnuf',
          'fuelabcdx8dy6gvugrppnkvsezyyh2qxusq57mvk2hueaa9smer220knuslpsnuf',
          'fuelfdas8dy6gvugrppnkvsezyyh2qxusq57mvk2hueaa9smer220knuslpsnuf',
        ]}
      />
      {/* </Dialog.Content> */}
    </Dialog>
  );
};
