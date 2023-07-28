import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export type AddAssetFormValues = {
  symbol: string;
  decimals: number;
};

const DEFAULT_VALUES = {
  symbol: '',
  decimals: 0,
};

type UseAddAssetOpts = {
  defaultValues?: AddAssetFormValues;
};

export const useAddAssetForm = (opts: UseAddAssetOpts = {}) => {
  const schema = yup.object({
    symbol: yup.string().required('Symbol is required'),
    decimals: yup.number().required('Decimals is required'),
  });

  const form = useForm<AddAssetFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: opts.defaultValues || DEFAULT_VALUES,
  });

  return form;
};
