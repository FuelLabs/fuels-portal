import { sha256 } from '@ethersproject/sha2';
import { encodePacked } from 'viem';

import type { CommitBlockHeader } from '../types';

// Produce the block consensus header hash
export function computeBlockHash(blockHeader: CommitBlockHeader): string {
  const serialized = encodePacked(
    ['bytes32', 'uint32', 'uint64', 'bytes32'],
    [
      blockHeader.prevRoot as `0x${string}`,
      Number(blockHeader.height),
      BigInt(blockHeader.timestamp),
      blockHeader.applicationHash as `0x${string}`,
    ]
  );
  return sha256(serialized);
}
