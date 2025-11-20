"use client"
import styles from '@/styles/ChartDashboard.module.scss'
import { useEffect, useState } from 'react';

type CardData = {
  label: string;
  value: string | number;
};


const DashboardCards = () => {
  const [totalBlocks, setTotalBlocks] = useState('Loading...');

  useEffect(() => {
    fetch('/api/stats')
      .then(response => response.json())
      .then(data => {
        // Assume the API returns numbers and convert them to a string
        setTotalBlocks(Number(data.length).toLocaleString());
      })
      .catch(error => {
        console.error('Failed to fetch stats:', error);
        setTotalBlocks('Failed to load');
      });
  }, []);

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.card}>
        <div className={`${styles.label} ${styles.purple}`}>Total blocks</div>
        <div className={styles.value}>{totalBlocks}</div>
      </div>
      <div className={styles.card}>
        <div className={`${styles.label} ${styles.purple}`}>Total IoT devices</div>
        <div className={styles.value}>92</div>
      </div>
      <div className={styles.card}>
        <div className={`${styles.label} ${styles.blue}`}>Total wallets</div>
        <div className={styles.value}>246</div>
      </div>
      <div className={styles.card}>
        <div className={`${styles.label} ${styles.blue}`}>Total subwallets</div>
        <div className={styles.value}>117</div>
      </div>
      <div className={styles.card}>
        <div className={`${styles.label} ${styles.orange}`}>Total smart contracts</div>
        <div className={styles.value}>43</div>
      </div>
      <div className={styles.card}>
        <div className={`${styles.label} ${styles.orange}`}>Total validators</div>
        <div className={styles.value}>4</div>
      </div>
    </div>
  );
};

export default DashboardCards;
