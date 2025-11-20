"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import styles from '@/styles/AccountDetails.module.scss'
import axios from "axios";
import Link from "next/link";
import Pagination from "@/components/pagination/pagination";
import QRCode from "qrcode.react";
import { buildPublicAppUrl } from "@/utils/browserUrl";
import { timeSince } from "@/utils/functions";
import { transactionTypes, costInTokensMapping } from '@/utils/types';
import LoadingSkeleton from "@/components/LoadingSkeleton/LoadingSkeleton";
export interface Transaction {
  signature: string;
  pubkey: string;
  timestamp: number;
  ip: string;
  name: number;
  tx_hash: string;
}

export interface Block {
  branch: string[];
  timestamp: number;
  signature: string;
  pubkey: string;
  txs: Transaction[];
  block_hash: string;
}

export interface BlockData {
  items: Block[];
  total: number;
  page: number;
  size: number;
  pages: number;
  wallet_balance: number;
  total_smart_contracts: number;
}
export default function AccountDetailsPage({ params }: { params: { id: string } }) {

  const pubkey = params.id


  const [account, setAccount] = useState<BlockData>()
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [tooltipText, setTooltipText] = useState('Copy to clipboard');


  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const pageSize = 20

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/accounts/${pubkey}?sort=1&page=${currentPage}&size=${rowsPerPage}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Convert the response into JSON
        setAccount(data)
        setBlocks(data.items);
        setTotalPages(Math.ceil(Number(data.total) / rowsPerPage));
        setTotal(Number(data.total));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }finally{
        setLoading(false);
      }
    };

    fetchData();
  }, [pubkey, currentPage, rowsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(pubkey);
    setTooltipText(`Copied: ${pubkey}`);
    setTimeout(() => {
      setTooltipText('Copy to clipboard'); // Reset tooltip text after a delay
    }, 2000);
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
  if (loading) return <LoadingSkeleton />;

  return (
    <div className={styles.account_container}>
      <h1>Wallet</h1>
      <div className={styles.info}>
        <div className={styles.imageBox}>
        <Image src={'/account_image.svg'} alt='icon' width={19} height={16} />
        </div>
        <div className={styles.id}>{pubkey}</div>
        <div className={styles.tooltip}>
          <Image src={'/copy.svg'} alt='copy' width={18} height={18} onClick={copyToClipboard} />
          <span className={styles.tooltiptext}>{tooltipText}</span>
        </div>

        <div onClick={toggleModal} className={styles.qr_code}>
          <Image src={'/qr_code.svg'} alt='QR code' width={18} height={18} />
        </div>
        {
          isModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalTitle}>QR-code</div>
                <QRCode value={buildPublicAppUrl('accounts', pubkey)} size={256} level="H" />
                <button onClick={toggleModal} className={styles.closeButton}>×</button>
              </div>
            </div>
          )
        }
      </div>
      <div className={styles.dashboard}>
        <div className={styles.overview_container}>
          <h2>Overview</h2>
          <div className={styles.data}>
            <div className={styles.wrap}>
              <div className={styles.label}>Total balance</div>
              <div className={styles.value}>{account?.wallet_balance}</div>
            </div>
            <div className={styles.wrap}>
              <div className={styles.label}>Number of transactions</div>
              <div className={styles.value}>{blocks[0]?.txs?.length}</div>
            </div>
            <div className={styles.wrap}>
              <div className={styles.label}>Number of smart contracts</div>
              <div className={styles.value}>{account?.total_smart_contracts}</div>
            </div>
          </div>

        </div>
        <div className={styles.overview_container}>
          <h2>Wallet</h2>
          <div className={styles.data}>
            <div className={styles.wrap}>
              <div className={styles.label}>Ikarus Token</div>
              <div className={styles.value}></div>
            </div>
            <div className={styles.wrap}>
              <div className={styles.label}>USDT</div>
              <div className={styles.value}></div>
            </div>
            <div className={styles.wrap}>
              <div className={styles.label}>BTT</div>
              <div className={styles.value}></div>
            </div>
            <div className={styles.wrap}>
              <div className={styles.label}>Other</div>
              <div className={styles.value}></div>
            </div>
          </div>
        </div>
      </div>
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
          {blocks?.map(block => block.txs.map((tx, index) => (
            <tr key={index}>
              <td className={styles.id}>
                <Link href={`/transactions/${tx.tx_hash}`}>
                  {tx.tx_hash.substring(0, 8)}
                </Link>
              </td>
              <td>{timeSince(new Date(tx?.timestamp * 1000))}</td>
              <td className={styles.signature}>{tx?.pubkey}</td>
              {/* <td className={styles.signature}>{tx.receiver}</td> */}
              <td>{getType(tx.tx_hash)}</td>
              <td>{getTypeFromTxHash(tx.tx_hash)}</td>
              {/* <td>1</td>  */}
              <td>
                <Image
                  src={'/icon_ok.png'}
                  alt="Status Icon"
                  width={24}
                  height={24}
                />
              </td>
            </tr>
          )))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        totalItems={total}
        onRowsPerPageChange={handleRowsPerPageChange}
        title="transactions"
      />
    </div>
  )
}