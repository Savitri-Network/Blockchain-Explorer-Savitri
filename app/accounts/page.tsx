"use client"
import { WalletContext } from "@/context/wallet";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import styles from '@/styles/Accounts.module.scss'
import axios from "axios";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import Pagination from "@/components/pagination/pagination";


export interface AccountInfo {
  status: string;
  balance?: number;
  owner?: string;
  last_ts?: number;
}

export interface Ledger {
  [account: string]: AccountInfo;
}

export interface LedgerData {
  length: number;
  ledger: Ledger;
}


export default function AccountPage() {
  const { sendToWallet, isWalletInstalled, publicKey } = useContext(WalletContext);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [accounts, setAccounts] = useState<Ledger>({});
  const [filteredAccounts, setFilteredAccounts] = useState<Ledger>({});

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<LedgerData>(`/api/accounts`);
        setAccounts(response.data.ledger);
        setFilteredAccounts(response.data.ledger);
        setTotalEntries(response.data.length); // Assuming API provides the total number of entries
        setTotalPages(Math.ceil(response.data.length / rowsPerPage));

      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter accounts based on the search term
    if (searchTerm) {
      const filtered = Object.entries(accounts).reduce((acc, [key, value]) => {
        if (key.includes(searchTerm)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Ledger);
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts(accounts); // No search term, show all accounts
    }
  }, [searchTerm, accounts]);


  const handleRowsPerPageChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page with new row count
  };

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };


  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // Implement your search logic or redirect logic here
  };

  return (
    <>
      <div className={styles.accountsHeader}>
        <h1>
          Wallets
        </h1>
        <div className={styles.cards}>
          <div className={styles.accountItem}>
            <h2 className={styles.purple}>Number of wallets (Total)</h2>
            <p>{totalEntries}</p>
          </div>
          <div className={styles.accountItem}>
            <h2 className={styles.blue}>New wallets (24h)</h2>
            <p>24</p>
          </div>
          <div className={styles.accountItem}>
            <h2 className={styles.orange}>Active wallets (24h)</h2>
            <p>{totalEntries}</p>
          </div>
        </div>
      </div>
      <div className={styles.accountsBody}>
        <div className={styles.searchContainer}>
          <span className={styles.labelText}>{totalEntries} wallets in total</span>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <FiSearch className={styles.icon} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by wallet ID"
              className={styles.searchInput}
            />

          </form>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.accountsTable}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Wallet</th>
                <th>Balance (Ikarus Token)</th>
                <th>Transactions count</th>
              </tr>
            </thead>
            <tbody>
              {accounts && Object.entries(filteredAccounts).map(([account, info], index) => (
                info.balance !== undefined && (
                  <tr key={account}>
                    <td>{index + 1}</td> {/* Display rank starting from 1 */}
                    <td className={styles.blue}>
                      <Link href={`/accounts/${account}`}>
                        {account}
                      </Link>
                    </td>
                    <td>{info.balance}</td>
                    <td>{info.last_ts}</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
          {/* <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            totalItems={totalEntries}
            onRowsPerPageChange={handleRowsPerPageChange}
          /> */}
        </div>
      </div>
    </>
  )
}