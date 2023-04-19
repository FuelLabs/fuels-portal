import { store } from '~/store';

export const useAccountSwitch = () => {
  return {
    handlers: {
      openAccountSwitch: store.openAccountSwitch,
    },
  };
};
