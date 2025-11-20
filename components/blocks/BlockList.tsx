import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/BlocksPage.module.scss'
import { FiSearch } from 'react-icons/fi'
import Pagination from '@/components/pagination/pagination'
import { timeSince } from '@/utils/functions'
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';

export interface BlockItem {
  status: string;
  _id: string;
  timestamp: number;
  signature: string;
  pubkey: string;
  branch: string[];
}

interface BlockListProps {
  blocks: BlockItem[];
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

const BlockList: React.FC<BlockListProps> = ({
  blocks,
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
        Blocks
      </div>
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.icon} />
          <input
            className={styles.input}
            type="text"
            placeholder="Search by block, status, hash, account"
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
            <option value="id">Block ID</option>
            <option value="hash">Hash</option>
            <option value="account">Account</option>
          </select>
        </div>
      </div>
      <div className={styles.containerTable}>
        <table className={styles.blocksTable}>
          <thead>
            <tr>
              <th>Block</th>
              <th>Status</th>
              <th>Time</th>
              <th>Hash</th>
              <th>Parent hashes</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map(block => (
              <tr key={block._id}>
                <td className={styles.id}>
                  <Link href={`/blocks/${block._id}`}>
                    {block._id.substring(block._id.length - 8)}
                  </Link>
                </td>
                <td className={styles.img}>
                  <Image
                    src={'/icon_ok.png'}
                    alt="Block Icon"
                    width={24}
                    height={24}
                  />
                </td>
                <td>{timeSince(new Date(block.timestamp * 1000))}</td>
                <td className={styles.signature}>{block.pubkey}</td>
                <td className={styles.pubkey}>
                  <span className={styles.validator_val}>
                    {block.branch.map((hash, index) => (
                      <Link key={index} href={`/blocks/${hash}`}>
                        {`${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`}
                        {index < block.branch.length - 1 ? ' ' : ''}
                      </Link>
                    ))}
                  </span>
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
          title='blocks'
        />
      </div>
    </div>
  );
};

export default BlockList;