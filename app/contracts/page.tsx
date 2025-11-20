"use client"
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from '@/styles/Accounts.module.scss'
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import Pagination from '@/components/pagination/pagination';

interface DataRow {
  contractHash: string;
  contractName: string;
  numberOfCalls: number;
  numberOfTransactions: number;
  createdOn: string;
  verifiedOn: string | null;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function SmartContracts() {

  const [data, setData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/contracts?sort=1&page=${currentPage}&size=${rowsPerPage}`);
        const jsonData = response.data.items;

        const formattedData: DataRow[] = jsonData.map((item: any) => {
          const numberOfCalls = item.events.length;
          const numberOfTransactions = item.events.filter((event: any) => event.tx_hash).length;
          const verifiedEvent = item.events.find((event: any) => event.tx_hash && event.tx_hash.startsWith('SB00'));
          const verifiedOn = verifiedEvent ? formatDate(verifiedEvent.timestamp) : null;

          return {
            contractHash: item.sc_id,
            contractName: item.sc_id, // Assuming contractName should be sc_id as per the instruction
            numberOfCalls: numberOfCalls,
            numberOfTransactions: numberOfTransactions,
            createdOn: formatDate(item.timestamp),
            verifiedOn: verifiedOn,
          };
        });

        setData(formattedData);
        setFilteredData(formattedData);
        setTotalEntries(response.data.total);
        setTotalPages(response.data.pages);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [rowsPerPage, currentPage]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'verified') {
      const verifiedContracts = data.filter(item => item.verifiedOn !== null);
      setFilteredData(verifiedContracts);
      setTotalEntries(verifiedContracts.length);
      setTotalPages(Math.ceil(verifiedContracts.length / rowsPerPage));
    } else {
      setFilteredData(data);
      setTotalEntries(data.length);
      setTotalPages(Math.ceil(data.length / rowsPerPage));
    }
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page with new row count
  };

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };
  useEffect(() => {
    const filtered = data.filter(item =>
      item.contractHash.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setTotalEntries(filtered.length);
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
    setCurrentPage(1); // Reset to first page with new filtered data
  }, [searchTerm, data, rowsPerPage]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };


  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className={styles.accountsHeader}>
        <h1>
          Contracts
        </h1>
        <div className={styles.cards}>
          <div className={styles.accountItem}>
            <h2 className={styles.purple}>Contracts deployed (total)</h2>
            <p>{totalEntries}</p>
          </div>
          <div className={styles.accountItem}>
            <h2 className={styles.purple}>Contracts deployed (24 h)</h2>
            <p>{totalEntries}</p>
          </div>
          <div className={styles.accountItem}>
            <h2 className={styles.blue}>Contracts verified (total)</h2>
            <p>{totalEntries}</p>
          </div>
          <div className={styles.accountItem}>
            <h2 className={styles.blue}>Contracts verified (24 h)</h2>
            <p>{totalEntries}</p>
          </div>
        </div>
      </div>
      <div className={styles.accountsBody}>
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
            onClick={() => handleTabClick('all')}
          >
            All Contracts
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'verified' ? styles.activeTab : ''}`}
            onClick={() => handleTabClick('verified')}
          >
            Verified Contracts
          </button>
        </div>

        <div className={styles.searchContainer}>
          <span className={styles.labelText}>{totalEntries} wallets in total</span>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <FiSearch className={styles.icon} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search "
              className={styles.searchInput}
            />

          </form>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.accountsTable}>
            <thead>
              <tr>
                <th>Contract hash</th>
                <th>Contract name</th>
                <th>Number of calls</th>
                <th>Number of transactions</th>
                <th>Created on</th>
                <th>Verified on</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                  <td className={styles.blue}>
                    <Link href={`/contracts/${item.contractHash}`}>
                      {`${item.contractHash.substring(0, 16)}...${item.contractHash.substring(item.contractHash.length - 16)}`}
                    </Link>
                  </td>
                  <td>
                    {item.contractName.substring(0, 32)}
                  </td>
                  <td>{item.numberOfCalls}</td>
                  <td>{item.numberOfTransactions}</td>
                  <td>{item.createdOn}</td>
                  <td>{item.verifiedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            totalItems={totalEntries}
            onRowsPerPageChange={handleRowsPerPageChange}
            title='contracts'
          />
        </div>
      </div>
    </>
  )
}