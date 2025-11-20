"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { timeSince } from '@/utils/functions';
import { transactionTypes, costInTokensMapping } from '@/utils/types';
import Pagination from '@/components/pagination/pagination';
import styles from '@/styles/TransactionContracts.module.scss'; // Update the import path to your actual SCSS file

interface TransactionItem {
  tx_hash: string;
  timestamp: number;
  pubkey: string;
  sc_type: number;
}

interface ApiResponse {
  total: string;
  items: TransactionItem[];
}

const TransactionsContracts = ({ id }: { id: string }) => {
  const sc_id = id;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const pageSize = 20

  useEffect(() => {
    fetch(`/api/contracts/${sc_id}`)
      .then(response => response.json())
      .then(data => {
        setTransactions(data.events);
        setTotal(data.events.length);
        setTotalPages(Math.ceil(data.events.length / rowsPerPage));

      })
      .catch(error => console.error(error));
  }, [currentPage, rowsPerPage]);


  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: any) => {
    setSelectedFilter(event.target.value);
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page
  };


  const getTypeFromTxHash = (tx_hash?: string): string => {
    if (typeof tx_hash === 'string') {
      const prefix = tx_hash.substring(0, 4);
      return costInTokensMapping[prefix] || '-';
    }
    return '-';
  };

  const getType = (txHash: string): string => {
    if (typeof txHash === 'string') {
      const prefix = txHash.substring(0, 4).toUpperCase();
      return transactionTypes[prefix] || 'Unknown transaction type';
    }
    return '-'
  };
  return (
    <div className={styles.blocks_container}>
      {/* <div className={styles.title}>
        Transactions
      </div> */}
      <div className={styles.searchContainer}>
        <div className={styles.count}>
          A total of {total} transactions
        </div>
        <div className={styles.searchBar}>
          <FiSearch className={styles.icon} />
          <input
            className={styles.input}
            type="text"
            placeholder="Search by block, transaction hash, account, smart contract"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <table className={styles.blocksTable}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Time</th>
            <th>From</th>
            <th>Type</th>
            <th>Cost (tokens)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((tx, index) => (
            <tr key={index}>
              <td className={styles.id}>
                <Link href={`/transactions/${tx.tx_hash}`}>
                  {tx.tx_hash.substring(0, 8)}
                </Link>
              </td>
              <td>{timeSince(new Date(tx.timestamp * 1000))}</td>
              <td className={styles.signature}>{tx.pubkey}</td>
              <td>{tx.sc_type}</td>
              <td>{getTypeFromTxHash(tx.tx_hash)}</td>
              <td>
                <Image
                  src={'/icon_ok.png'} // Replace with actual path to status icons
                  alt="Status Icon"
                  width={24}
                  height={24}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        totalItems={total}
        onRowsPerPageChange={handleRowsPerPageChange}
        title='transactions'
      />
    </div>
  );
};

export default TransactionsContracts;
