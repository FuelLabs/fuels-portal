import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

type MachineContext = {
  theme: 'dark' | 'light';
};

export type ThemeMachineEvents = {
  type: 'TOGGLE_THEME';
};

export const themeMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./themeMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      events: {} as ThemeMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          TOGGLE_THEME: {
            actions: ['assignToggleTheme'],
          },
        },
      },
      toogling: {
        entry: {
          type: 'assignToggleTheme',
          target: 'idle',
        },
      },
    },
  },
  {
    actions: {
      assignToggleTheme: assign({
        theme: (ctx: MachineContext) => {
          return ctx.theme === 'dark' ? 'light' : 'dark';
        },
      }),
    },
  }
);

export type ThemeMachine = typeof themeMachine;
export type ThemeMachineService = InterpreterFrom<ThemeMachine>;
export type ThemeMachineState = StateFrom<ThemeMachine>;
