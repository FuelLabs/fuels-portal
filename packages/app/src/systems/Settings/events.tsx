import type { Store } from '../Store';
import { Services } from '../Store';

export function themeEvents(store: Store) {
  return {
    toggleTheme() {
      store.send(Services.theme, { type: 'TOGGLE_THEME' });
    },
  };
}
