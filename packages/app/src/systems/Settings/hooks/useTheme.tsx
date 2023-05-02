import { darkTheme, lightTheme, useFuelTheme } from '@fuel-ui/react';
import type { Mode } from 'connectkit/build/types';

export function useTheme() {
  const { setTheme, current } = useFuelTheme();
  function toggleTheme() {
    setTheme(current === 'dark' ? lightTheme : darkTheme);
  }

  return {
    handlers: {
      toggleTheme,
    },
    theme: current as Mode,
  };
}
