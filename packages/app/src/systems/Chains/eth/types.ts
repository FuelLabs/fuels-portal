// TODO: this BlockHeader in ETH side probably changed with new infra, check

// The BlockHeader structure.
export interface BlockHeader {
  // Consensus
  prevRoot: string;
  height: string;
  timestamp: string;

  // Application
  daHeight: string;
  txCount: string;
  outputMessagesCount: string;
  txRoot: string;
  outputMessagesRoot: string;
}

// The MessageOutput structure.
export interface MessageOutput {
  sender: string;
  recipient: string;
  amount: string;
  nonce: string;
  data: string;
}
