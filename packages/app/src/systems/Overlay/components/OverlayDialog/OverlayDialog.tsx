import { cssObj } from '@fuel-ui/css';
import { Dialog } from '@fuel-ui/react';

import { AccountSwitch } from '~/systems/Bridge/components/AccountSwitch';
import { useOverlay } from '~/systems/Overlay';

const OVERLAY_HEIGHT = 100;
const OVERLAY_WIDTH = 400;

export function OverlayDialog() {
  const overlay = useOverlay();

  return (
    <Dialog isOpen={overlay.isDialogOpen}>
      <Dialog.Content css={styles.content}>
        {/** TODO: remove the AccountSwitch component and replace with corresponding smart components once completed */}
        {overlay.is('accounts.switch') && (
          <AccountSwitch
            accounts={[
              'fuel17kx8dy6gvugrppnkvsezyyh2qxusq57mvk2hueaa9smer220knuslpsnuf',
              'fuel17kx8dy6gvugrppnkvsezyyh2qxusq57mvk2hueaa9smer220knuslpsnuf',
              'fuel17kx8dy6gvugrppnkvsezyyh2qxusq57mvk2hueaa9smer220knuslpsnuf',
            ]}
            onSelect={() => {}}
            onConnect={() => {}}
            onDisconnect={() => {}}
          />
        )}
      </Dialog.Content>
    </Dialog>
  );
}

const styles = {
  content: cssObj({
    width: OVERLAY_WIDTH,
    minHeight: OVERLAY_HEIGHT,
    maxWidth: OVERLAY_WIDTH,
    maxHeight: 'none',
    background: '$bodyColor',

    '.fuel_dialog--heading, .fuel_dialog--footer': {
      borderColor: '$gray2',
    },
    '.fuel_dialog--description': {
      flex: 1,
      overflowY: 'auto',
      height: '100%',
    },
    '.fuel_dialog--heading': cssObj({
      display: 'flex',
      justifyContent: 'space-between',
    }),
    '.fuel_dialog--footer': cssObj({
      button: {
        width: '100%',
      },
    }),
    form: cssObj({
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }),
    'button[data-action="closed"]': {
      px: '$1',
    },
  }),
};
