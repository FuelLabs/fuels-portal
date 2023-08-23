// TODO: this file should be completely removed once the fuel sdk start returning whole header data

const blockQuery = `query blockQuery($id: String!) {
  block(id: $id) {
    id
    header {
      id
      daHeight
      transactionsCount
      messageReceiptCount
      transactionsRoot
      messageReceiptRoot
      height
      prevRoot
      time
      applicationHash
    }
  }
}
`;
export interface Block {
  id: string;
  header: Header;
}

export interface Header {
  id: string;
  daHeight: string;
  transactionsCount: string;
  messageReceiptCount: string;
  transactionsRoot: string;
  messageReceiptRoot: string;
  height: string;
  prevRoot: string;
  time: string;
  applicationHash: string;
}

export async function getBlock({
  blockHash,
  providerUrl,
}: {
  blockHash: string;
  providerUrl: string;
}): Promise<Block> {
  const response = await fetch(providerUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: blockQuery,
      variables: {
        id: blockHash,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  return response.data.block;
}
