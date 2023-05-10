import { useMutation } from '@tanstack/react-query';
import { useFuel } from 'src/components';

export const useConnect = () => {
  const { fuel } = useFuel();

  const { mutate, ...mutateProps } = useMutation({
    mutationFn: async () => {
      return fuel?.connect();
    },
  });

  return {
    connect: mutate,
    ...mutateProps,
  };
};
