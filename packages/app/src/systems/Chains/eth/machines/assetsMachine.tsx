import type { StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { AssetService } from '../services';
import { ethLogoSrc } from '../utils';

import type { BridgeAsset } from '~/systems/Bridge';
import { FetchMachine } from '~/systems/Core';

export const AssetList = [
  {
    address:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    symbol: 'ETH',
    image: ethLogoSrc,
    decimals: 18,
  },
];

// export type Asset = {
//   assetId: string;
//   imageUrl?: string;
//   decimals: number;
//   symbol: string;
//   name?: string;
// };

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
};

type AssetListMachineEvents =
  | {
      type: 'ADD_ASSET';
      input: { asset: BridgeAsset };
    }
  | {
      type: 'CHANGE_ASSET';
      input: { asset: BridgeAsset };
    }
  | {
      type: 'REMOVE_ASSET';
      input: { address: string };
    };

export const assetListMachine = createMachine(
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
    initial: 'setListedAssets',
    states: {
      setListedAssets: {
        tags: ['loading'],
        invoke: {
          src: 'setListedAssets',
          onDone: [
            {
              target: 'fetchingAssets',
            },
          ],
        },
      },
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
          CHANGE_ASSET: {
            actions: [],
          },
          REMOVE_ASSET: {
            target: 'removing',
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
    },
  },
  {
    actions: {
      assignAssets: assign({
        assetList: (_, ev) => ev.data,
      }),
    },
    services: {
      setListedAssets: FetchMachine.create<null, void>({
        showError: true,
        async fetch() {
          await Promise.all(
            AssetList.map((asset) =>
              AssetService.upsertAsset({
                data: {
                  ...asset,
                  image: asset.image,
                },
              })
            )
          );
        },
      }),
      fetchAssets: FetchMachine.create<null, BridgeAsset[]>({
        showError: true,
        async fetch() {
          return AssetService.getAssets();
        },
      }),
      addAsset: FetchMachine.create<{ asset: BridgeAsset }, boolean>({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to add asset');
          }

          await AssetService.addAsset({ data: input.asset });
          return true;
        },
      }),
      removeAsset: FetchMachine.create<
        {
          address: string;
        },
        boolean
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.address) {
            throw new Error('Missing data');
          }

          await AssetService.removeAsset(input);
          return true;
        },
      }),
    },
  }
);

export type AssetListMachine = typeof assetListMachine;
export type AssetListMachineState = StateFrom<AssetListMachine>;
