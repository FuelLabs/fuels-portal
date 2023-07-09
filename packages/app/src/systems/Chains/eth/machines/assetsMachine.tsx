import type { StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { AssetService } from '../services';
import { ethLogoSrc } from '../utils';

import { FetchMachine } from '~/systems/Core';

export const AssetList = [
  {
    assetId:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    name: 'Ether',
    symbol: 'ETH',
    imageUrl: ethLogoSrc,
    decimals: 18,
  },
];

export type Asset = {
  assetId: string;
  imageUrl?: string;
  decimals: number;
  symbol: string;
  name?: string;
};

type MachineContext = {
  assetList?: Asset[];
};

type MachineServices = {
  fetchAssets: {
    data: Asset[];
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
      input: { asset: Asset };
    }
  | {
      type: 'CHANGE_ASSET';
      input: { asset: Asset };
    }
  | {
      type: 'REMOVE_ASSET';
      input: { assetId: string };
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
      //   addAssetAddress: assign({
      //     assetList: (ctx, ev) => {
      //       const assetInfoList = ctx.assetList || [nativeAsset];
      //       // TODO should we check for duplicates here?
      //       assetInfoList.push(ev.input.asset);
      //       return assetInfoList;
      //     },
      //   }),
      //   removeAsset: assign({
      //     assetList: (ctx, ev) => {
      //       const assetInfoList = ctx.assetList || [nativeAsset];
      //       const index = assetInfoList.indexOf(ev.input.asset);
      //       if (index !== -1) {
      //         assetInfoList.splice(index, 1);
      //       }
      //       return assetInfoList;
      //     },
      //   }),
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
                  imageUrl: asset.imageUrl,
                },
              })
            )
          );
        },
      }),
      fetchAssets: FetchMachine.create<null, Asset[]>({
        showError: true,
        async fetch() {
          return AssetService.getAssets();
        },
      }),
      addAsset: FetchMachine.create<{ asset: Asset }, boolean>({
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
          assetId: string;
        },
        boolean
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.assetId) {
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
