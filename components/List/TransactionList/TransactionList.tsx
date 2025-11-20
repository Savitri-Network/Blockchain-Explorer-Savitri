"use client"
import React, { useEffect, useState } from 'react'
import styles from '@/styles/List.module.scss'
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSkeleton from '@/components/LoadingSkeleton/LoadingSkeleton';
import { timeSince } from '@/utils/functions';
import { transactionTypes } from '@/utils/types';

interface Transaction {
  tx_hash: string;
  pubkey: string;
  signature?: string;
  amount?: number;
  receiver?: string;
  timestamp: number;
}


const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/transactions?page=1&size=50&sort=1');
        const fetchedTransactions: Transaction[] = response.data.items.slice(0, 10);
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  const getType = (txHash: string): string => {
    const prefix = txHash.substring(0, 4).toUpperCase();
    return transactionTypes[prefix] || 'Unknown transaction type';
  };

  if (loading) {
    return (
      <div className={styles.latestTransactions}>
        <h2 className={styles.title}>Latest transactions</h2>
        <ul className={styles.transactionList}>
          {[...Array(10)].map((_, index) => (
            <li key={index} className={styles.transactionItem}>
              <div className={styles.block_header}>
                <div className={`${styles.icon} ${styles.transaction}`} >
                  <Image
                    src={'/transaction.svg'}
                    alt="Block Icon"
                    width={20}
                    height={20}
                  />
                </div>
                <div className={styles.blockNumber}>
                  <Link href={`#`} className={styles.transactionId}>
                    <div className={styles.loader}></div>
                  </Link>
                  <span className={styles.timeAgo}>Time ago</span>

                </div>
              </div>
              <div className={styles.transactionDetails}>
                <div className={styles.wrap_validator}>
                  <span className={styles.validator}>From: </span>
                  <div className={styles.loader}></div>
                </div>

                <div className={styles.wrap_validator}>
                  <span className={styles.validator}>Type: </span>
                  <div className={styles.loader}></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/transactions">
          <button className={styles.viewAllButton}>View all transactions</button>
        </Link>
      </div>
    )
  };
  return (
    <div className={styles.latestTransactions}>
      <h2 className={styles.title}>Latest transactions</h2>
      <ul className={styles.transactionList}>
        {transactions.map((transaction, index) => (
          <li key={index} className={styles.transactionItem}>
            <div className={styles.block_header}>
              <div className={`${styles.icon} ${styles.transaction}`} >
                <Image
                  src={'/transaction.svg'}
                  alt="Block Icon"
                  width={20}
                  height={20}
                />
              </div>
              <div className={styles.blockNumber}>
                <Link href={`/transactions/${transaction.tx_hash}`} className={styles.transactionId}>
                  {transaction.tx_hash.substring(0, 8)}
                </Link>
                <span className={styles.timeAgo}>{timeSince(new Date(transaction.timestamp * 1000))}</span>
              </div>
            </div>
            <div className={styles.transactionDetails}>
              <div className={styles.wrap_validator}>
                <span className={styles.validator}>From: </span>
                <div className={styles.validator_val}>
                  <Link href={`/accounts/${transaction.pubkey}`}>
                    {`${transaction.pubkey.substring(0, 6)}...${transaction.pubkey.substring(transaction.pubkey.length - 6)}`}
                  </Link>
                </div>
              </div>
              {transaction.receiver ? (
                <div className={styles.wrap_validator}>
                  <span className={styles.validator}>To: </span>
                  <div className={styles.validator_val}>
                    {transaction.receiver}
                  </div>
                </div>
              ) : (
                <div className={styles.wrap_validator}>
                  <span className={styles.validator}>Type: </span>
                  <div className={styles.validator}>
                    {getType(transaction.tx_hash)}
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Link href="/transactions">
        <button className={styles.viewAllButton}>View all transactions</button>
      </Link>
    </div>
  );
}

export default TransactionList