import type { ThemeMachineState } from '../machines/themeMachine';

import { Services, store } from '~/store';

const selectors = {
  theme: (state: ThemeMachineState) => state.context?.theme || 'light',
};

export function useTheme() {
  const theme = store.useSelector(Services.theme, selectors.theme);

  return {
    handlers: {
      toggleTheme: store.toggleTheme,
    },
    theme,
  };
}
