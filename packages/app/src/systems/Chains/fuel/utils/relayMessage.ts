import type {
  Message,
  WalletUnlocked as FuelWallet,
  TransactionRequestLike,
  TransactionResponse,
  Provider,
} from 'fuels';
import {
  ZeroBytes32,
  ScriptTransactionRequest,
  arrayify,
  InputType,
  hexlify,
  OutputType,
  Predicate,
  bn,
  MAX_GAS_PER_TX,
} from 'fuels';

import { resourcesToInputs } from './transaction';

const contractMessagePredicate =
  '0x1a405000910000206144000b6148000542411480504cc04c72580020295134165b501012615c000772680002595d7001616171015b61a0106165711a5b6400125b5c100b240400002400000009e68fb304ff158f1ae4a1f7675d19fc83d1843b9263f79a1c2350dbf9ea41dc';
const contractMessageScript =
  '0x1a40500091000050504500205049102461540117614c011d5050c02c60453020604940042d45540a24000000b93e6a3d';

function getCommonRelayableMessages(provider: Provider) {
  // Create a predicate for common messages
  const predicate = new Predicate(contractMessagePredicate, provider);

  // Details for relaying common messages with certain predicate roots
  const relayableMessages: CommonMessageDetails[] = [
    {
      name: 'Message To Contract v1.3',
      predicateRoot: predicate.address.toHexString(),
      predicate: contractMessagePredicate,
      script: contractMessageScript,
      buildTx: async (
        relayer: FuelWallet,
        message: Message,
        details: CommonMessageDetails,
        txParams: Pick<
          TransactionRequestLike,
          'gasLimit' | 'gasPrice' | 'maturity'
        >
      ): Promise<ScriptTransactionRequest> => {
        const script = arrayify(details.script);
        const predicateBytecode = arrayify(details.predicate);
        // get resources to fund the transaction
        const resources = await relayer.getResourcesToSpend([
          {
            amount: bn.parseUnits('5'),
            assetId: ZeroBytes32,
          },
        ]);
        // convert resources to inputs
        const spendableInputs = resourcesToInputs(resources);

        // get contract id
        const data = arrayify(message.data);
        if (data.length < 32)
          throw new Error('cannot find contract ID in message data');
        const contractId = hexlify(data.slice(0, 32));

        // build the transaction
        const transaction = new ScriptTransactionRequest({
          script,
          gasLimit: MAX_GAS_PER_TX,
          ...txParams,
        });
        transaction.inputs.push({
          type: InputType.Message,
          amount: message.amount,
          sender: message.sender.toHexString(),
          recipient: message.recipient.toHexString(),
          witnessIndex: 0,
          data: message.data,
          nonce: message.nonce,
          predicate: predicateBytecode,
        });
        transaction.inputs.push({
          type: InputType.Contract,
          txPointer: ZeroBytes32,
          contractId,
        });
        transaction.inputs.push(...spendableInputs);

        transaction.outputs.push({
          type: OutputType.Contract,
          inputIndex: 1,
        });
        transaction.outputs.push({
          type: OutputType.Change,
          to: relayer.address.toB256(),
          assetId: ZeroBytes32,
        });
        transaction.outputs.push({
          type: OutputType.Variable,
        });

        transaction.witnesses.push('0x');

        return transaction;
      },
    },
  ];

  return relayableMessages;
}

type CommonMessageDetails = {
  name: string;
  predicateRoot: string;
  predicate: string;
  script: string;
  buildTx: (
    relayer: FuelWallet,
    message: Message,
    details: CommonMessageDetails,
    txParams: Pick<TransactionRequestLike, 'gasLimit' | 'gasPrice' | 'maturity'>
  ) => Promise<ScriptTransactionRequest>;
};

// Relay commonly used messages with predicates spendable by anyone
export async function relayCommonMessage({
  relayer,
  message,
  txParams,
}: {
  relayer: FuelWallet;
  message: Message;
  txParams?: Pick<TransactionRequestLike, 'gasLimit' | 'gasPrice' | 'maturity'>;
}): Promise<TransactionResponse> {
  // find the relay details for the specified message
  let messageRelayDetails: CommonMessageDetails | undefined;
  const predicateRoot = message.recipient.toHexString();

  // eslint-disable-next-line no-restricted-syntax
  for (const details of getCommonRelayableMessages(relayer.provider)) {
    if (details.predicateRoot.toLowerCase() === predicateRoot.toLowerCase()) {
      messageRelayDetails = details;
      break;
    }
  }
  if (!messageRelayDetails)
    throw new Error('message is not a common relayable message');

  // build and send transaction
  const transaction = await messageRelayDetails.buildTx(
    relayer,
    message,
    messageRelayDetails,
    txParams || {}
  );

  return relayer.sendTransaction(transaction);
}
