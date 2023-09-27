import { toast } from '@fuel-ui/react';
import type { StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { VITE_ETH_ERC20 } from '~/config';
import type { BridgeAsset } from '~/systems/Bridge';
import { FetchMachine } from '~/systems/Core/machines';

import { AssetList } from '../constants';
import type { AssetServiceInputs } from '../services';
import { AssetService } from '../services';

type MachineContext = {
  assetList?: BridgeAsset[];
};

type MachineServices = {
  fetchAssets: {
    data: BridgeAsset[];
  };
  addAsset: {
    data: boolean;
  };
  removeAsset: {
    data: boolean;
  };
  faucetErc20: {
    data: boolean;
  };
};

type AssetListMachineEvents =
  | {
      type: 'ADD_ASSET';
      input: { asset: BridgeAsset };
    }
  | {
      type: 'REMOVE_ASSET';
      input: { address?: string };
    }
  | {
      type: 'FAUCET_ERC20';
      input: { address?: string };
    };

export const ethAssetListMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./assetsMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as AssetListMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'fetchingAssets',
    states: {
      fetchingAssets: {
        tags: ['loading'],
        invoke: {
          src: 'fetchAssets',
          onDone: [
            {
              actions: ['assignAssets'],
              target: 'idle',
            },
          ],
        },
      },
      idle: {
        on: {
          ADD_ASSET: {
            target: 'adding',
          },
          REMOVE_ASSET: {
            target: 'removing',
          },
          FAUCET_ERC20: {
            target: 'fauceting',
          },
        },
      },
      adding: {
        tags: ['loading'],
        invoke: {
          src: 'addAsset',
          data: {
            input: (_: MachineContext, ev: AssetListMachineEvents) => ev.input,
          },
          onDone: {
            target: 'fetchingAssets',
          },
        },
      },
      removing: {
        tags: ['loading'],
        invoke: {
          src: 'removeAsset',
          data: {
            input: (_: MachineContext, ev: AssetListMachineEvents) => ev.input,
          },
          onDone: [
            {
              target: 'fetchingAssets',
            },
          ],
        },
      },
      fauceting: {
        tags: ['loading'],
        invoke: {
          src: 'faucetErc20',
          data: {
            input: (_: MachineContext, ev: AssetListMachineEvents) => ev.input,
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
        assetList: (_, ev) => ev.data,
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
          const defaultAssets = [...AssetList];

          if (VITE_ETH_ERC20) {
            defaultAssets.push({
              symbol: 'LFBG',
              decimals: 18,
              address: VITE_ETH_ERC20,
            });
          }
          const assets = await AssetService.getAssets();
          return [...defaultAssets, ...assets];
        },
      }),
      addAsset: FetchMachine.create<
        AssetServiceInputs['addAsset'],
        MachineServices['addAsset']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to add asset');
          }

          await AssetService.addAsset({ asset: input.asset });
          return true;
        },
      }),
      removeAsset: FetchMachine.create<
        AssetServiceInputs['removeAsset'],
        MachineServices['removeAsset']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('Missing data');
          }

          await AssetService.removeAsset(input);
          return true;
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

export type EthAssetListMachine = typeof ethAssetListMachine;
export type EthAssetListMachineState = StateFrom<EthAssetListMachine>;
