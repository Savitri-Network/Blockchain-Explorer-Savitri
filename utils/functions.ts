import { costInTokensMapping, transactionTypes } from "./types";
import type { DataType, DataTypeResult } from "./dataTypes";

export function timeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minute' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  }
  return Math.floor(seconds) + ' second' + (Math.floor(seconds) > 1 ? 's' : '') + ' ago';
}

export const getDataTypeAndLink = (data: DataType | Record<string, unknown>): DataTypeResult => {
  if (data && typeof data === 'object') {
    if ('_id' in data && typeof data._id === 'string') {
      return { type: 'Block', link: `/blocks/${data._id}` };
    } else if ('tx_hash' in data && typeof data.tx_hash === 'string') {
      return { type: 'Transaction', link: `/transactions/${data.tx_hash}` };
    } else if ('sc_id' in data && typeof data.sc_id === 'string') {
      return { type: 'SmartContract', link: `/contracts/${data.sc_id}` };
    } else if ('account' in data && typeof data.account === 'string') {
      return { type: 'Wallet', link: `/accounts/${data.account}` };
    }
  }
  return { type: 'Unknown', link: '#' };
};

export const getTypeFromTxHash = (tx_hash?: string): string => {
  if (typeof tx_hash === 'string') {
    const prefix = tx_hash.substring(0, 4);
    return costInTokensMapping[prefix] || '-';
  }
  return '-';
};


export const getType = (txHash: string): string => {
  if (typeof txHash === 'string') {
    const prefix = txHash.substring(0, 4).toUpperCase();
    return transactionTypes[prefix] || 'Unknown transaction type';
  }
  return '-'
};