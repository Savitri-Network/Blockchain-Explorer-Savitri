import { FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import Pagination from '@/components/pagination/pagination';
import styles from '@/styles/BlocksPage.module.scss';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import { getType, getTypeFromTxHash, timeSince } from '@/utils/functions';


interface Transaction {
  tx_hash: string;
  pubkey: string;
  receiver: string;
  amount: number;
  timestamp: number;
  signature: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  total: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  selectedFilter: string;
  rowsPerPage: number;
  loading: boolean;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  total,
  currentPage,
  totalPages,
  searchTerm,
  selectedFilter,
  rowsPerPage,
  loading,
  onSearchChange,
  onFilterChange,
  onPageChange,
  onRowsPerPageChange,
}) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className={styles.blocks_container}>
      <div className={styles.title}>
        Transactions
      </div>
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.icon} />
          <input
            className={styles.input}
            type="text"
            placeholder="Search by transaction ID, type, status, account"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
        <div className={styles.dropdown}>
          <select
            className={styles.select}
            value={selectedFilter}
            onChange={onFilterChange}
          >
            <option value="All">All</option>
            <option value="id">transaction ID</option>
            <option value="type">type</option>
            {/* <option value="status">status</option> */}
          </select>
        </div>
      </div>
      <div className={styles.containerTable}>
        <table className={styles.blocksTable}>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Time</th>
              <th>From</th>
              {/* <th>To</th> */}
              <th>Type</th>
              {/* <th>Amount (tokens)</th> */}
              <th>Cost (tokens)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td className={styles.id}>
                  <Link href={`/transactions/${tx.tx_hash}`} className={styles.blue}>
                    {tx.tx_hash.substring(0, 8)}
                  </Link>
                </td>
                <td>{timeSince(new Date(tx.timestamp * 1000))}</td>
                <td className={styles.id}>
                  <Link href={`/accounts/${tx.pubkey}`} className={styles.blue}>
                    {tx.pubkey}
                  </Link>
                </td>
                <td>{getType(tx.tx_hash)}</td>
                <td>{getTypeFromTxHash(tx.tx_hash)}</td>
                <td>
                  <Image
                    src={'/icon_ok.png'}
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
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          totalItems={total}
          onRowsPerPageChange={onRowsPerPageChange}
          title='transactions'
        />
      </div>
    </div>
  );
};

export default TransactionList;