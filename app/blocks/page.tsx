"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import LoadingSkeleton from '@/components/LoadingSkeleton/LoadingSkeleton'
import dynamic from 'next/dynamic';

const DynamicBlockList = dynamic(() => import('@/components/blocks/BlockList'), {
  ssr: false,
  loading: () => <LoadingSkeleton />
})
export interface BlockItem {
  status: string;
  _id: string;
  timestamp: number;
  signature: string;
  pubkey: string;
  branch: string[];
}

export interface ApiResponse {
  total: string;
  items: BlockItem[];
}

const BlocksPage = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [filteredBlocks, setFilteredBlocks] = useState<BlockItem[]>([]);

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // `http://master-node.prometeochain.io/data/?page=${currentPage}&size=${rowsPerPage}&sort=0`
  useEffect(() => {
    setLoading(true); // Start loading
    fetch(`/api/blocks?page=${currentPage}&size=${rowsPerPage}&sort=1`)
      .then(response => response.json())
      .then(data => {
        setBlocks(data.items);
        setFilteredBlocks(data.items);
        setTotalPages(Math.ceil(data.totalItems / rowsPerPage));
        setTotal(data.total);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false); // Stop loading regardless of the outcome
      });
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    const filterBlocks = () => {
      const filtered = blocks?.filter(block => {
        if (selectedFilter === 'All') {
          return block._id.includes(searchTerm) ||
            block.pubkey.includes(searchTerm) ||
            block.signature.includes(searchTerm)
        }
        switch (selectedFilter) {
          case 'id':
            return block._id.includes(searchTerm);
          case 'hash':
            return block.signature.includes(searchTerm);
          case 'account':
            return block.pubkey.includes(searchTerm);
          default:
            return true;  // By default, include all blocks if no specific filter matches
        }

      });
      setFilteredBlocks(filtered);
    };

    filterBlocks();
  }, [searchTerm, selectedFilter, blocks]);

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



  if (loading) {
    return (
      <LoadingSkeleton />
    )
  }

  return (
    <DynamicBlockList
      blocks={filteredBlocks}
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

  )
}

export default BlocksPage