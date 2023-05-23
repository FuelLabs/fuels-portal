import { useQuery } from '@tanstack/react-query';
import { Address } from 'fuels';

export const useMessages = (
  owner: string | undefined,
  first: number,
  fuel_provider_url: string
) => {
  const address = owner
    ? new Address(owner as `fuel${string}`).toHexString()
    : '';
  const MESSAGES_QUERY = `
        query {
            messages(owner: "${address}", first: ${first}) {
                nodes {
                    amount
                    sender
                    recipient
                    nonce
                    data
                    daHeight
                }
            }
        }
    `;

  const args = {
    owner,
    first,
  };

  const query = useQuery(
    ['messages'],
    async () => {
      const response = await fetch(fuel_provider_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: MESSAGES_QUERY,
          variables: args,
        }),
      });
      const json = await response.json();
      console.log('MESSAGES:', json);
      return response;
    },
    { enabled: !!owner }
  );

  return {
    messages: query.data,
    ...query,
  };
};
