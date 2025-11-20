"use client"
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingSkeleton from '@/components/LoadingSkeleton/LoadingSkeleton';


const DynamicTransactionList = dynamic(() => import('@/components/transactions/TransactionLists'), {
  ssr: false,
  loading: () => <LoadingSkeleton />
})
interface Transaction {
  tx_hash: string;
  pubkey: string;
  receiver: string;
  amount: number;
  timestamp: number;
  signature: string;
}

interface TransactionResponse {
  items: Transaction[];
  total: number;
}



const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);

  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    setLoading(true);

    axios.get<TransactionResponse>(`/api/transactions?page=${currentPage}&size=${rowsPerPage}&sort=1`)
      .then(response => {
        setAllTransactions(response.data.items);
        setFilteredTransactions(response.data.items);
        setTotalPages(Math.ceil(response.data.total / rowsPerPage));
        setTotal(response.data.total);
      })
      .catch(error => {
        console.error('Failed to fetch transactions:', error);
        setAllTransactions([]);
        setFilteredTransactions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    const filterTransactions = () => {
      let tempTransactions = allTransactions;

      if (searchTerm) {
        tempTransactions = tempTransactions.filter(transaction => {
          if (selectedFilter === 'All') {
            return transaction.tx_hash?.includes(searchTerm) ||
              transaction.pubkey?.includes(searchTerm) ||
              transaction.receiver?.includes(searchTerm) ||
              transaction.signature?.includes(searchTerm) ||
              `getTypeFromTxHash(${transaction.tx_hash})`.includes(searchTerm);
          }
          switch (selectedFilter) {
            case 'id':
              return transaction.tx_hash.includes(searchTerm);
            case 'type':
              return `getTypeFromTxHash(${transaction.tx_hash})`.includes(searchTerm);
            case 'status':
              return `statusDerivedFrom(${transaction.signature})`.includes(searchTerm);
            default:
              return true;
          }
        });
      }
      setFilteredTransactions(tempTransactions);
    };

    filterTransactions();
  }, [searchTerm, selectedFilter]);


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
    setCurrentPage(1);
  };



  if (loading) {
    return (
      <LoadingSkeleton />
    )
  }

  return (
    <DynamicTransactionList
      transactions={filteredTransactions}
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
      searchTerm={searchTerm}
      selectedFilter={selectedFilter}
      rowsPerPage={rowsPerPage}
      loading={loading}
      onSearchChange={handleSearchChange}
      onFilterChange={handleFilterChange}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
};

export default TransactionsPage;
