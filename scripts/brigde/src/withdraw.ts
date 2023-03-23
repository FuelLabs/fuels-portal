import type { ReceiptMessageOut } from 'fuels';
import { Address, bn, ReceiptType } from 'fuels';
import { setTimeout } from 'timers/promises';

import { FuelMessagePortal__factory } from '../fuel-v2-contracts/factories/FuelMessagePortal__factory';

import type { BlockHeader, MessageOutput } from './types';
import { logBalances, ethWallet, fuelProvider, fuelWallet } from './utils';

async function main() {
  await logBalances('initial');

  const resp: {
    FuelMessagePortal: string;
  } = await fetch('http://localhost:8080/deployments.local.json').then((res) =>
    res.json()
  );

  const txFuel = await fuelWallet.withdrawToBaseLayer(
    Address.fromString(ethWallet.address),
    bn.parseUnits('0.1')
  );
  const result = await txFuel.waitForResult();

  const message = result.receipts.find((r) => {
    return r.type === ReceiptType.MessageOut;
  }) as ReceiptMessageOut;

  if (!message) {
    throw new Error('No message found');
  }

  const withdrawMessageProof = await fuelProvider.getMessageProof(
    result.transactionId,
    message.messageID
  );
  await setTimeout(20_000);

  if (!withdrawMessageProof) {
    throw new Error('Failed to fetch message proof');
  }

  const messageOutput: MessageOutput = {
    sender: withdrawMessageProof.sender.toHexString(),
    recipient: withdrawMessageProof.recipient.toHexString(),
    amount: withdrawMessageProof.amount.toHex(),
    nonce: withdrawMessageProof.nonce,
    data: withdrawMessageProof.data,
  };
  const blockHeader: BlockHeader = {
    prevRoot: withdrawMessageProof.header.prevRoot,
    height: withdrawMessageProof.header.height.toHex(),
    timestamp: bn(withdrawMessageProof.header.time).toHex(),
    daHeight: withdrawMessageProof.header.daHeight.toHex(),
    txCount: withdrawMessageProof.header.transactionsCount.toHex(),
    outputMessagesCount:
      withdrawMessageProof.header.outputMessagesCount.toHex(),
    txRoot: withdrawMessageProof.header.transactionsRoot,
    outputMessagesRoot: withdrawMessageProof.header.outputMessagesRoot,
  };
  const messageInBlockProof = {
    key: Number(withdrawMessageProof.proofIndex.toString()),
    proof: withdrawMessageProof.proofSet.slice(0, -1),
  };

  const fuelPortal = FuelMessagePortal__factory.connect(
    resp.FuelMessagePortal,
    ethWallet
  );
  // Relay transaction on ETH
  const txETH = await fuelPortal.relayMessageFromFuelBlock(
    messageOutput,
    blockHeader,
    messageInBlockProof,
    withdrawMessageProof.signature
  );
  await txETH.wait();
  await logBalances('final');
}

main();
