const BLOCK_DATE_KEY_SUBSTRING = 'ethBlockDate-';
const HASH_DONE_KEY_SUBSTRING = 'ethToFuelTx';

export const getBlockDate = (blockHash: string) => {
  return localStorage.getItem(getBlockDateKeyString(blockHash));
};

export const setBlockDate = (blockHash: string, blockDate: string) => {
  return localStorage.setItem(getBlockDateKeyString(blockHash), blockDate);
};

const getBlockDateKeyString = (blockHash: string) => {
  return `${BLOCK_DATE_KEY_SUBSTRING}${blockHash}`;
};

export const getHashDone = (blockHash: string) => {
  return localStorage.getItem(getHashDoneKeyString(blockHash));
};

export const setHashDone = (blockHash: string, isDone: string) => {
  return localStorage.setItem(getHashDoneKeyString(blockHash), isDone);
};

const getHashDoneKeyString = (blockhash: string) => {
  return `${HASH_DONE_KEY_SUBSTRING}${blockhash}-done`;
};

export const cleanChainStorage = () => {
  Object.keys(localStorage).forEach((key) => {
    if (
      key.includes(BLOCK_DATE_KEY_SUBSTRING) ||
      key.includes(HASH_DONE_KEY_SUBSTRING)
    ) {
      localStorage.removeItem(key);
    }
  });
};
