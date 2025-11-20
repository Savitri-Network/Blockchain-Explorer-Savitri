import React from 'react';
import styles from '@/styles/Pagination.module.scss';

interface PaginationProps {
  title: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  totalItems: number;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, rowsPerPage, totalItems, onRowsPerPageChange, title }) => {

  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);


  return (
    <div className={styles.bottom}>
      <div className={styles.selectedRow}>
        <label htmlFor="rows-per-page">Rows per page:</label>
        <select id="rows-per-page" value={rowsPerPage.toString()} onChange={onRowsPerPageChange}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className={styles.pagination}>
        <div className={styles.countBlock}>
          {startItem} - {endItem} of {totalItems} {title}
        </div>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          &#60;
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          &#62;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
