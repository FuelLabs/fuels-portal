import type {
  OverlayMachineState,
  OverlayKeys,
} from '../machines/overlayMachine';

import { Services, store } from '~/store';

const selectors = {
  isDialogOpen: (state: OverlayMachineState) => state.matches('opened'),
  overlay(state: OverlayMachineState) {
    return state.matches('opened') && state.context.overlay;
  },
  metadata(state: OverlayMachineState) {
    return state.matches('opened') && state.context.metadata;
  },
};

export function useOverlay<T = void>() {
  const isDialogOpen = store.useSelector(
    Services.overlay,
    selectors.isDialogOpen
  );
  const overlay = store.useSelector(Services.overlay, selectors.overlay);
  const metadata = store.useSelector(Services.overlay, selectors.metadata);

  function is(key: OverlayKeys | ((value: string) => boolean)) {
    return typeof key === 'function' ? key(overlay || '') : overlay === key;
  }

  return {
    is,
    isDialogOpen,
    overlay,
    metadata: metadata as T,
    open: store.openOverlay,
    close: store.closeOverlay,
  };
}
