'use client'
import React, { useEffect, useState } from 'react';
import styles from '@/styles/TransactionDetails.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode.react';
import { buildPublicAppUrl } from "@/utils/browserUrl";
import LoadingSkeleton from '@/components/LoadingSkeleton/LoadingSkeleton';
import Link from 'next/link';
import axios from 'axios';


interface TransactionData {
  block_hash: string;
  tx: {
    from: string;
    to: string;
    receiver: string;
    amount: string;
    pubkey: string;
    timestamp: number;
    signature: string;
    tx_hash: string;
    status: string;
    validator: string;
  };
}


interface Transaction {
  tx_hash: string;
  pubkey: string;
  receiver: string;
  amount: number;
  timestamp: number;
  signature: string;
}
import { transactionTypes, costInTokensMapping } from '@/utils/types';


const TransactionDetails = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const txHash = params.id

  const [transactionData, setTransactionData] = useState<TransactionData>();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockIndexes, setBlockIndexes] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [transactionsPerPage] = useState<number>(20);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/transactions/${txHash}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: TransactionData = await response.json();
        setTransactionData(data);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transaction data';
        setError(errorMessage);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [txHash]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/transactions?page=${currentPage}&size=${transactionsPerPage}&sort=1`);
        const txs: Transaction[] = response.data.items;
        setAllTransactions(txs); // Store all transactions
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [txHash, currentPage, transactionsPerPage]);




  const goToPreviousPage = () => {
    const currentIndex = allTransactions.findIndex(tx => tx.tx_hash === txHash);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      router.push(`/transactions/${allTransactions[previousIndex].tx_hash}`);
    }
  };

  const goToNextPage = () => {
    const currentIndex = allTransactions.findIndex(tx => tx.tx_hash === txHash);
    const nextIndex = currentIndex + 1;

    if (nextIndex < allTransactions.length) {
      router.push(`/transactions/${allTransactions[nextIndex].tx_hash}`);
    }
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

  let formattedTimestamp = '';
  if (transactionData?.tx?.timestamp) {
    const timestampDate = new Date(transactionData.tx.timestamp * 1000);
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


  if (loading) return <LoadingSkeleton />;
  if (error) return <div>Error: {error}</div>;
  if (!transactionData) return <div>No data found for transaction hash: {txHash}</div>;

  return (
    <div className={styles.transactionDetails}>
      <div className={styles.blockHeader}>
        <div className={styles.blockNav}>
          <div className={`${styles.navLink} ${styles.rotate}`} onClick={goToPreviousPage}><Image src={'/arrow.svg'} alt='arrow' width={10} height={10} /></div>
          <span className={styles.currentBlock}>Transaction {txHash.substring(0, 8)}</span>
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
                <QRCode value={buildPublicAppUrl('transactions', txHash)} size={256} level="H" />
                <button onClick={toggleModal} className={styles.closeButton}>×</button>
              </div>
            </div>
          )
        }

      </div>
      <div className={styles.detailsContainer}>
        <h2 className={styles.title}>Transaction details</h2>
        <div className={styles.details_wrap}>
          <div className={styles.column}>
            {transactionData?.tx?.pubkey &&
              <div className={styles.detail}>
                <span className={styles.label}>From</span>
                <span className={`${styles.value} ${styles.blue}`}>
                  <Link href={`/accounts/${transactionData.tx?.pubkey}`} className={`${styles.blue}`}>
                    {`${transactionData.tx?.pubkey}`}
                  </Link>
                </span>
              </div>
            }
            {
              transactionData?.tx?.receiver &&
              <div className={styles.detail}>
                <span className={styles.label}>To</span>
                <span className={styles.value}>
                  <span className={`${styles.value} ${styles.blue}`}>{transactionData?.tx?.receiver}</span>
                </span>
              </div>
            }
            <div className={styles.detail}>
              <span className={styles.label}>Transaction type</span>
              <span className={styles.value}>{transactionData?.tx?.tx_hash ? getType(transactionData?.tx?.tx_hash) : 'Unknown'}
              </span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Transaction amount</span>
              <span className={styles.value}>{getTypeFromTxHash(transactionData?.tx?.tx_hash)}</span>
            </div>
            {/* <div className={styles.detail}>
            <span className={styles.label}>Transaction cost</span>
            <span className={styles.value}>{transactionData?.tx?.transactionCost }</span>
          </div> */}
            <div className={styles.detail}>
              <span className={styles.label}>Timestamp</span>
              <span className={styles.value}>{formattedTimestamp}</span>
            </div>
            <div className={styles.statusSection}>
              <Image src="/icon_ok.png" alt="Confirmed" width={24} height={24} />
              <span className={styles.status}>{transactionData?.tx?.status}</span>
              <span className={styles.confirmations}>Confirmed by 1 Blocks</span>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.detail}>
              <span className={styles.label}>Hash</span>
              <span className={styles.value}>{transactionData?.tx?.tx_hash}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Block</span>
              <span className={`${styles.value} ${styles.blue}`}>
                <Link href={`/blocks/${transactionData?.block_hash}`} className={`${styles.blue}`}>
                  {transactionData?.block_hash?.substring(0, 6)}
                </Link>
              </span>
            </div>
            {transactionData?.tx?.pubkey &&
              <div className={styles.detail}>
                <span className={styles.label}>Public key</span>
                <span className={styles.value}>{transactionData?.tx?.pubkey}</span>
              </div>
            }
            {transactionData?.tx?.signature &&
              <div className={styles.detail}>
                <span className={styles.label}>Signature</span>
                <span className={styles.value}>{transactionData?.tx?.signature}</span>
              </div>
            }
            {transactionData?.tx?.validator &&
              <div className={styles.detail}>
                <span className={styles.label}>Validator</span>
                <span className={styles.value}>{transactionData?.tx?.validator}</span>

              </div>
            }
          </div>
        </div>

      </div>

    </div>
  );

};

export default TransactionDetails;

