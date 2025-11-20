"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/StatsDashord.module.scss';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { FaCube, FaCheckSquare, FaExchangeAlt, FaSignature, FaNode, FaNetworkWired } from 'react-icons/fa'; // icons for the statistics
import { fetchAll, fetchBlocks, fetchTransactions, fetchAccounts, fetchSmartContracts } from './api';
import { getDataTypeAndLink } from '@/utils/functions';


const StatsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const [totalBlocks, setTotalBlocks] = useState('');
  const [finalisedBlocks, setFinalisedBlocks] = useState('');
  const [totalTransactions, setTotalTransactions] = useState('');
  const [signedTransactions, setSignedTransactions] = useState('');
  const [totalNodes, setTotalNodes] = useState('');
  const [totalMasternodes, setTotalMasternodes] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (!value) {
      setSearchResults([]);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(event.target.value);
  };

  const handleSearchClick = async () => {
    if (searchTerm) {
      await fetchData(searchTerm, selectedFilter);
    }
  };

  const fetchStatsData = async () => {
    try {
      const response = await fetch('/api/stats', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      setTotalBlocks(data.length?.toLocaleString() || '0');
      setFinalisedBlocks(data.length?.toLocaleString() || '0');
      setTotalTransactions(data.txs_length?.toLocaleString() || '0');
      setSignedTransactions(data.txs_length?.toLocaleString() || '0');
      setTotalNodes(data.nodes_length?.toLocaleString() || '0');
      setTotalMasternodes(data.masternodes_length?.toLocaleString() || '0');
    } catch (error) {
      console.error('Failed to fetch stats data:', error);
    }
  };

  useEffect(() => {
    fetchStatsData();
    const interval = setInterval(() => {
      fetchStatsData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);



  const fetchData = async (query: string, filter: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    let results = [];
    switch (filter) {
      case 'Blocks':
        results = await fetchBlocks(query);
        break;
      case 'Transactions':
        results = await fetchTransactions(query);
        break;
      case 'Accounts':
        results = await fetchAccounts(query);
        break;
      case 'SmartContracts':
        results = await fetchSmartContracts(query);
        break;
      case 'All':
      default:
        results = await fetchAll(query);
        break;
    }
    setSearchResults(results);
  };

  return (
    <div className={styles.statsDashboard}>
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <FiSearch className={`${styles.icon} `} />
          <input
            className={styles.input}
            type="text"
            placeholder="Search by block, transaction hash, account, smart contract"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className={styles.dropdown}>
          <select
            className={styles.select}
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="Blocks">Blocks</option>
            <option value="Transactions">Transactions</option>
            <option value="Accounts">Wallets</option>
            <option value="SmartContracts">Smart Contracts</option>
          </select>
        </div>
        <div className={styles.searchButton} onClick={handleSearchClick}>
          Search
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className={styles.suggestions}>
          <ul>
            {searchResults.slice(0, 10).map((result, index) => {
              const { type, link } = getDataTypeAndLink(result);
              return (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {type}: {result._id || result.tx_hash || result.account || result.sc_id}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.block}`}>
            <Image src="/block.svg" alt="icon" width={24} height={24} />
          </div>
          <div className={styles.content}>
            <h3 className={styles.label}>Total blocks</h3>
            <p className={styles.value}>{totalBlocks}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.block}`}>
            <Image src="/block.svg" alt="icon" width={24} height={24} />
          </div>
          <div className={styles.content}>
            <h3 className={styles.label}>Finalised blocks</h3>
            <p className={styles.value}>{finalisedBlocks}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.transaction}`}>
            <Image src="/transaction.svg" alt="icon" width={24} height={24} />
          </div>
          <div className={styles.content}>
            <h3 className={styles.label}>Total transactions</h3>
            <p className={styles.value}>{totalTransactions}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.transaction}`}>
            <Image src="/transaction.svg" alt="icon" width={24} height={24} />
          </div>
          <div className={styles.content}>
            <h3 className={styles.label}>Signed transactions</h3>
            <p className={styles.value}>{signedTransactions}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.nodes}`}>
            <Image src="/nodes.svg" alt="icon" width={24} height={24} />
          </div>
          <div className={styles.content}>
            <h3 className={styles.label}>Total nodes</h3>
            <p className={styles.value}>{totalNodes}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.nodes}`}>
            <Image src="/nodes.svg" alt="icon" width={24} height={24} />
          </div>
          <div className={styles.content}>
            <h3 className={styles.label}>Total masternodes</h3>
            <p className={styles.value}>{totalMasternodes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
