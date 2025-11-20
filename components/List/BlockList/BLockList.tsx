"use client"
import React, { useEffect, useState } from 'react'
import { Suspense } from 'react';
import styles from '@/styles/List.module.scss'
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { timeSince } from '@/utils/functions';
interface Block {
  _id: string;
  timestamp: number;
  pubkey: string;
  txs: Array<any>;
  branch: string[];
}
const BLockList = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState<boolean>(true);



  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await axios.get('/api/blocks/?page=1&size=50&sort=1');
        const fetchedBlocks = response.data.items.slice(0, 10);
        setBlocks(fetchedBlocks);
      } catch (error) {
        console.error('Error fetching blocks:', error);
      }
      setLoading(false);
    };

    fetchBlocks();
  }, []);


  if (loading) {
    return (
      <div className={styles.latestBlocks}>
        <h2 className={styles.title}>Latest blocks</h2>
        <ul className={styles.blockList}>
          {[...Array(10)].map((_, index) => (
            <li key={index} className={styles.blockItem}>
              <div className={styles.block_header}>
                <div className={styles.icon}>
                  <Image
                    src={'/block.svg'}
                    alt="Block Icon"
                    width={20}
                    height={20}
                  />
                </div>
                <div className={styles.blockNumber}>
                  <Link href={'#'} className={styles.number}>
                    <div className={styles.loader}></div>
                  </Link>
                  <span className={styles.timeAgo}>Time ago</span>
                </div>
              </div>
              <div className={styles.blockInfo}>
                <div className={styles.wrap_validator}>
                  <div className={styles.validator}>Parent hashes: </div>
                  <div className={styles.loader}></div>
                  {/* <div className={styles.validator_val}>
                  </div> */}
                </div>
                <div className={styles.transactions}>
                  <div className={styles.label}>
                    Transactions:
                  </div>
                  <div className={styles.loader}></div>

                </div>
              </div>
            </li>
          ))}
        </ul>
        <div>
          <Link href="/blocks">
            <button className={styles.viewAllButton}>View all blocks</button>
          </Link>
        </div>
      </div>

    )
  }
  return (
    <div className={styles.latestBlocks}>
      <h2 className={styles.title}>Latest blocks</h2>
      <ul className={styles.blockList}>
        {blocks.map((block, index) => (
          <li key={block._id} className={styles.blockItem}>
            <div className={styles.block_header}>
              <div className={styles.icon}>
                <Image
                  src={'/block.svg'}
                  alt="Block Icon"
                  width={20}
                  height={20}
                />
              </div>
              <div className={styles.blockNumber}>
                <Link href={`/blocks/${block._id}`} className={styles.number}>
                  {block._id.substring(block._id.length - 8)}
                </Link>
                <span className={styles.timeAgo}>{timeSince(new Date(block.timestamp * 1000))}</span>
              </div>
            </div>
            <div className={styles.blockInfo}>
              <div className={styles.wrap_validator}>
                <div className={styles.validator}>Parent hashes: </div>
                <div className={styles.validator_val}>
                  {block.branch.map((hash, index) => (
                    <span key={index}>
                      <Link href={`/blocks/${hash}`}>
                        {`${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`}
                      </Link>
                      {index < block.branch.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.transactions}>
                <div className={styles.label}>
                  Transactions:
                </div>
                <div className={styles.len}>
                  {block.txs.length}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div>


        <Link href="/blocks" >
          <button className={styles.viewAllButton}>View all blocks</button>
        </Link>
      </div>
    </div>
  )
}

export default BLockList