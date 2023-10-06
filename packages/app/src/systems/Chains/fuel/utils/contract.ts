import { ZeroBytes32, hash, concat } from 'fuels';

export function getContractTokenId(
  contractId: `0x${string}`,
  subId = ZeroBytes32
) {
  return hash(concat([contractId, subId]));
}
