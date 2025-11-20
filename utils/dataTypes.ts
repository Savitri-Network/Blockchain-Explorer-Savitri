/**
 * Type definitions for blockchain data structures
 */

export interface BlockData {
  _id: string;
  [key: string]: unknown;
}

export interface TransactionData {
  tx_hash: string;
  [key: string]: unknown;
}

export interface ContractData {
  sc_id: string;
  [key: string]: unknown;
}

export interface AccountData {
  account: string;
  [key: string]: unknown;
}

export type DataType = BlockData | TransactionData | ContractData | AccountData;

export interface DataTypeResult {
  type: 'Block' | 'Transaction' | 'SmartContract' | 'Wallet' | 'Unknown';
  link: string;
}

