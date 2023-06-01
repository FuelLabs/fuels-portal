import { Image, FuelLogo, Text } from '@fuel-ui/react';
import { useEffect } from 'react';

import { useTxEthToFuel } from '../hooks';
import { ethLogoSrc } from '../utils';

import { BridgeTxItem } from '~/systems/Bridge';

type TxListItemEthToFuelProps = {
  age: string;
  asset: {
    assetImageSrc: string;
    assetAmount: string;
    assetSymbol: string;
  };
  onClick: () => void;
  txHash: string;
  key: string;
};

export const TxListItemEthToFuel = ({
  age,
  asset,
  onClick,
  txHash,
  key,
}: TxListItemEthToFuelProps) => {
  let isDone = false;
  const val = localStorage.getItem(`ethToFuelTx${txHash}-done`);
  if (val) {
    isDone = true;
  }
  const { steps } = useTxEthToFuel({
    id: txHash,
    skipAnalyzeTx: isDone,
  });

  const overrideStatus = isDone ? <Text>Done!</Text> : steps && steps[3].status;

  useEffect(() => {
    if (steps && steps[3].isDone) {
      localStorage.setItem(`ethToFuelTx${txHash}-done`, 'true');
    }
  }, [steps]);

  return (
    <BridgeTxItem
      age={age}
      asset={asset}
      onClick={onClick}
      txHash={txHash}
      key={key}
      fromLogo={<Image width={14} height={14} src={ethLogoSrc} />}
      toLogo={<FuelLogo size={14} />}
      status={overrideStatus}
    />
  );
};
