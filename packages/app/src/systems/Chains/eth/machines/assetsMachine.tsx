import type { StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { ETH_UNITS, ethLogoSrc } from '../utils';

// TODO STORE ASSETS IN A DB

export type Asset = {
  address?: string;
  image?: string;
  decimals: number;
  symbol: string;
};

const nativeAsset: Asset = {
  decimals: ETH_UNITS,
  symbol: 'ETH',
  image: ethLogoSrc,
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
    initial: 'idle',
    states: {
      idle: {
        on: {
          ADD_ASSET: {
            actions: ['addAssetAddress'],
          },
          CHANGE_ASSET: {
            actions: [],
          },
          REMOVE_ASSET: {
            actions: ['removeAsset'],
          },
        },
      },
    },
  },
  {
    actions: {
      addAssetAddress: assign({
        assetList: (ctx, ev) => {
          const assetInfoList = ctx.assetList || [nativeAsset];
          // TODO should we check for duplicates here?
          assetInfoList.push(ev.input.asset);
          return assetInfoList;
        },
      }),
      removeAsset: assign({
        assetList: (ctx, ev) => {
          const assetInfoList = ctx.assetList || [nativeAsset];
          const index = assetInfoList.indexOf(ev.input.asset);
          if (index !== -1) {
            assetInfoList.splice(index, 1);
          }
          return assetInfoList;
        },
      }),
    },
  }
);

export type AssetListMachine = typeof assetListMachine;
export type AssetListMachineState = StateFrom<AssetListMachine>;
