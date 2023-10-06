import { toast } from '@fuel-ui/react';
import assetList from '@fuels/assets';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { VITE_ETH_ERC20, VITE_FUEL_FUNGIBLE_TOKEN_ID } from '~/config';
import { ETH_CHAIN, FUEL_CHAIN } from '~/systems/Chains/config';
import { FetchMachine } from '~/systems/Core/machines/fetchMachine';

import type { Asset, AssetServiceInputs } from '../services/asset';
import { AssetService } from '../services/asset';

export type MachineContext = {
  assets?: Asset[];
};

type MachineServices = {
  fetchAssets: {
    data: Asset[];
  };
  faucetErc20: {
    data: boolean;
  };
};

type MachineEvents = {
  type: 'FAUCET_ERC20';
  input: { address?: string };
};

export const assetsMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./assetsMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'fetchingAssets',
    states: {
      fetchingAssets: {
        tags: ['loading'],
        invoke: {
          src: 'fetchAssets',
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignAssets'],
              target: 'idle',
            },
          ],
        },
      },
      idle: {
        on: {
          FAUCET_ERC20: {
            target: 'fauceting',
          },
        },
      },
      fauceting: {
        tags: ['loadingFaucet'],
        invoke: {
          src: 'faucetErc20',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              actions: ['notifyFaucetSuccess'],
              target: 'idle',
            },
          ],
        },
      },
    },
  },
  {
    actions: {
      assignAssets: assign({
        assets: (_, ev) => ev.data,
      }),
      notifyFaucetSuccess: () => {
        toast.success('Added tokens to your wallet');
      },
    },
    services: {
      fetchAssets: FetchMachine.create<
        null,
        MachineServices['fetchAssets']['data']
      >({
        showError: true,
        async fetch() {
          const defaultAssets: Asset[] = [...assetList];

          if (VITE_ETH_ERC20) {
            defaultAssets.push({
              icon: null,
              name: 'Test Token',
              symbol: 'TKN',
              networks: [
                {
                  type: 'ethereum',
                  chainId: ETH_CHAIN.id,
                  decimals: 18,
                  address: VITE_ETH_ERC20,
                },
                {
                  type: 'fuel',
                  chainId: FUEL_CHAIN.id,
                  decimals: 9,
                  assetId: VITE_FUEL_FUNGIBLE_TOKEN_ID,
                },
              ],
            });
          }
          return defaultAssets;
        },
      }),
      faucetErc20: FetchMachine.create<
        AssetServiceInputs['faucetErc20'],
        MachineServices['faucetErc20']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('Missing data');
          }

          await AssetService.faucetErc20(input);
          return true;
        },
      }),
    },
  }
);

export type AssetsMachine = typeof assetsMachine;
export type AssetsMachineState = StateFrom<AssetsMachine>;
export type AssetsMachineService = InterpreterFrom<AssetsMachine>;
