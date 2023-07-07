import type { StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { AssetService } from '../services';

import { FetchMachine } from '~/systems/Core';

// TODO STORE ASSETS IN A DB

export type Asset = {
  assetId?: string;
  imageUrl?: string;
  decimals: number;
  symbol: string;
  name?: string;
};

type MachineContext = {
  assetList?: Asset[];
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
      input: { asset: Asset };
    };

export const assetListMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./assetsMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
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
          CHANGE_ASSET: {
            actions: [],
          },
          REMOVE_ASSET: {
            actions: ['removeAsset'],
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
            target: 'idle',
          },
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
    },
  }
);

export type AssetListMachine = typeof assetListMachine;
export type AssetListMachineState = StateFrom<AssetListMachine>;
