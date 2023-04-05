/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TransactionResult } from 'fuels';
import { toast, Link } from '@fuel-ui/react';
import { copy } from 'clipboard';

import { BLOCK_EXPLORER_URL } from '~/config';
import type { Maybe } from '~/types';

const panicError = (msg: string) => (
  <div>
    Unexpected block execution error
    <br />
    <span className="text-xs text-gray-300">
      <a href="#" onClick={() => copy(msg)}>
        Click here
      </a>{' '}
      to copy block response
    </span>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleError(error: any) {
  const msg = error?.message;
  toast.error(msg?.includes('Panic') ? panicError(msg) : msg, {
    duration: 100000000,
    id: msg,
  });
}

export function getBlockExplorerLink(path: string) {
  return `${BLOCK_EXPLORER_URL}${path}?providerUrl=${encodeURIComponent(
    process.env.VITE_FUEL_PROVIDER_URL as string
  )}`;
}

type TxLinkProps = {
  id?: string;
};

export function TxLink({ id }: TxLinkProps) {
  return (
    <p className="text-xs text-gray-300 mt-1">
      <Link isExternal href={getBlockExplorerLink(`/transaction/${id}`)}>
        View it on Fuel Explorer
      </Link>
    </p>
  );
}

export function txFeedback(
  txMsg: string,
  onSuccess?: (data: TransactionResult<any>) => void | Promise<void>
) {
  return async (data: Maybe<TransactionResult<any>>) => {
    const txLink = <TxLink id={data?.transactionId} />;

    /**
     * Show a toast success message if status.type === 'success'
     */
    if (data?.status.type === 'success') {
      await onSuccess?.(data);
      toast.success(
        <>
          {' '}
          {txMsg} {txLink}{' '}
        </>,
        { duration: 8000 }
      );
      return;
    }

    /**
     * Show a toast error if status.type !== 'success''
     */
    toast.error(<>Transaction reverted! {txLink}</>);
  };
}
