"use client"
import { useEffect, useState, FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode.react';
import { buildPublicAppUrl } from "@/utils/browserUrl";

import styles from '@/styles/BlockDetails.module.scss'
import LoadingSkeleton from '@/components/LoadingSkeleton/LoadingSkeleton';

interface Transaction {
  receiver?: string;
  amount?: number;
  pubkey: string;
  timestamp: number;
  signature?: string;
  status?: string;
  tx_hash?: string;

}

interface BlockData {
  branch: string[];
  timestamp: number;
  pubkey: string;
  signature: string;
  txs: Record<string, Transaction>;
}
import { transactionTypes, costInTokensMapping } from '@/utils/types';


export default function BlockDetails({ params }: { params: { id: string } }) {
  const router = useRouter();

  const blockHash = params.id
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [blockData, setBlockData] = useState<BlockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [blockIndexes, setBlockIndexes] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);


  const [error, setError] = useState<string | null>(null);

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
  let formattedTimestamp = '';

  if (blockData) {
    const timestampDate = new Date(blockData.timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short'
    };
    formattedTimestamp = timestampDate.toLocaleString('en-US', options);
  }

  useEffect(() => {
    if (blockHash) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/blocks/${blockHash}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();

          // Assuming the key is the blockHash and inside it is the block data
          const blockData = Object.values(data)[0] as BlockData;
          setBlockData(blockData);

          // Transform the txs object into an array of transactions
          const txsArray = blockData.txs
            ? Object.entries(blockData.txs).map(([key, tx]) => ({
              ...tx,
              tx_hash: key, // Include the tx_hash
            }))
            : [];

          setTransactions(txsArray);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [blockHash]);


  useEffect(() => {
    const fetchBlockIndexes = async () => {
      try {
        const response = await fetch(`/api/blocks/?page=1&size=${rowsPerPage}&sort=1`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlockIndexes(data.items.map((item: any) => item._id));
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchBlockIndexes();
  }, []);
  
  const goToPreviousPage = () => {
    const currentIndex = blockIndexes.indexOf(blockHash);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      const previousBlockHash = blockIndexes[previousIndex];
      router.push(`/blocks/${previousBlockHash}`);
    }
  };
  const goToNextPage = () => {
    const currentIndex = blockIndexes.indexOf(blockHash);
    const nextIndex = currentIndex + 1;

    if (nextIndex < blockIndexes.length) {
      const nextBlockHash = blockIndexes[nextIndex];
      router.push(`/blocks/${nextBlockHash}`);
    }
  };


  if (loading) return <LoadingSkeleton />;
  if (error) return <p>Error: {error}</p>;
  if (!blockData) return null;

  // Format the timestamp


  return (
    <div className={styles.blockDetailsContainer}>
      <div className={styles.blockHeader}>
        <div className={styles.blockNav}>
          <div className={`${styles.navLink} ${styles.rotate}`} onClick={goToPreviousPage} ><Image src={'/arrow.svg'} alt='arrow' width={10} height={10} /></div>
          <span className={styles.currentBlock}>Block {blockHash.substring(0, 8)}</span>
          <div className={styles.navLink} onClick={goToNextPage}><Image src={'/arrow.svg'} alt='arrow' width={10} height={10} /></div>
        </div>
        <div onClick={toggleModal} className={styles.qr_code}>
          <Image src={'/qr_code.svg'} alt='QR code' width={18} height={18} />
        </div>
        {
          isModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalTitle}>QR-code</div>
                <QRCode value={buildPublicAppUrl('blocks', blockHash)} size={256} level="H" />
                <button onClick={toggleModal} className={styles.closeButton}>×</button>
              </div>
            </div>
          )
        }

      </div>
      <div className={styles.block_grid}>
        <div className={styles.blockDetails}>
          <h1>Block Details </h1>
          <div className={styles.detailItem}>
            <span className={styles.label}>Hash:</span>
            <span className={styles.value}>{blockHash}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Parent Hashes:</span>
            <div className={`${styles.value} ${styles.blue}`}>
              {blockData && blockData.branch && blockData.branch.map((branch, index) => (
                <div key={index} style={{ marginBottom: '6px' }}>{branch}</div>
              ))}
            </div>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Timestamp:</span>
            <span className={styles.value}>{formattedTimestamp}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Public Key:</span>
            <span className={styles.value}>{blockData.pubkey}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Signature:</span>
            <span className={styles.value}>{blockData.signature}</span>
          </div>
          {blockData && blockData.txs && (
            <div className={styles.detailItem}>
              <span className={styles.label}>Fee:</span>
              <span className={styles.value}>
                {/* Access the first entry of the transactions */}
                {getTypeFromTxHash(Object.keys(blockData.txs)[0])}
              </span>
            </div>
          )}
          {/* <div className={styles.detailItem}>
            <span className={styles.label}>Validator:</span>

            <div className={styles.group}>
              <Image src={'/validator.svg'} alt="icon" width={28} height={28} />
              <span className={`${styles.value} ${styles.blue}`}>cTKk2kgPEFyhSDqixnE5RqgmptxfTNJjc8NqTXQktBAEcFuv3</span>
            </div>
          </div> */}
          <div className={styles.detailItem}>
            <span className={styles.label}>Status:</span>
            <div className={styles.group}>
              <Image src={'/icon_ok.png'} alt="icon" width={28} height={28} />
              <span className={styles.value}>Finalised</span>
            </div>
          </div>
        </div>
        <div className={styles.transactions}>
          <h1>Transactions  ({transactions.length})</h1>
          <div className={styles.transactionsHeader}>
            <span className={styles.headerItem}>Transaction ID</span>
            <span className={styles.headerItem}>Type</span>
            <span className={styles.headerItem}>Amount</span>
            <span className={styles.headerItem}>Status</span>
          </div>
          <ul className={styles.transactionList}>
            {transactions?.map((transaction, index) => (
              <li key={index} className={styles.transactionItem}>
                <Link href={`/transactions/${transaction.tx_hash}`} className={`${styles.from} ${styles.blue}`}>{transaction?.tx_hash?.substring(0, 8)}</Link>
                <span className={styles.type}>
                  {transaction.tx_hash ? getType(transaction.tx_hash) : 'Unknown'}
                </span>
                <span className={styles.amount}>
                  {transaction.amount ? `${transaction.amount} USDT` : '-'}
                </span>
                <span className={`${styles.status} ${styles[transaction.status ?? '']}`}>
                  {transaction.status === 'success' && '✅'}
                  {transaction.status === 'pending' && '🟡'}
                  {transaction.status === 'failed' && '❌'}
                  {/* You may need to handle the possibility of `transaction.status` being undefined */}

                  <Image src={'/icon_ok.png'} alt='icon' width={18} height={18} />

                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}

