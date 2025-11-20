"use client"
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import styles from '@/styles/SmartContractDetails.module.scss'
import TransactionsContracts from '@/components/contracts/transactions/TransactionListContracts';
import { FiSearch } from 'react-icons/fi';
import { ContractCode } from '@/components/contracts/code/ContractCode';
import { ReadCode } from '@/components/contracts/readcode/ReadCode';
import { WriteCode } from '@/components/contracts/writecode/WriteCode';


export default function ContractDetails({ params }: { params: { id: string } }) {
  const id = params.id
  const [activeTab, setActiveTab] = useState('Contract');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = ['Contract', 'Transactions'];

  const [contract, setContract] = useState({
    hash: '',
    totalAssets: '',
    transactions: '',
    transfers: '',
    creator: '',
    receiver: '',
    creationDate: '',
    closingConditions: []

  });
  const [events, setEvents] = useState<{ id: string; time: string; action: string; }[]>([]);

  const [activeTab2, setActiveTab2] = useState('Code');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const getActionType = (txHash: string) => {
    if (txHash.startsWith('SB00')) return 'Verified contract';
    if (txHash.startsWith('SC99')) return 'Created';
    if (txHash.startsWith('ZZ00')) return 'Closed';
    if (txHash.startsWith('EX00')) return 'Opened';
    return 'Unknown action';
  };

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const response = await fetch(`/api/contracts/${id}`, {
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        const contractData = {
          hash: data.sc_id,
          totalAssets: data.actions.amount.toLocaleString(),
          transactions: data.events[0]?.tx_hash || 'N/A',
          transfers: data.events.length.toString(),
          creator: data.events[0]?.pubkey || 'N/A',
          receiver: data.actions.reciever,
          creationDate: new Date(data.timestamp * 1000).toLocaleString(),
          closingConditions: data.closing_conditions
        };

        setContract(contractData);

        const eventList = data.events.map((event: any) => ({
          id: event.tx_hash,
          time: new Date(event.timestamp * 1000).toLocaleString(),
          action: getActionType(event.tx_hash)
        }));

        setEvents(eventList);
      } catch (error) {
        console.error('Failed to fetch contract data:', error);
      }
    };

    fetchContractData();
  }, [id]);



  const renderTabs = () => {
    switch (activeTab) {
      case 'Contract':
        return (
          <div className={styles.tabContainer2}>
            <div className={styles.tabs}>
              {['Code'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab2(tab)}
                  className={`${styles.tab} ${activeTab2 === tab ? styles.activeTab : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className={styles.content}>
              {renderContent()}
            </div>
          </div>
        )
      // case "Token balances":
      //   return <TokenBalances />F

      case 'Transactions':
        return <TransactionsContracts id={id} />

      // case 'Transfers':
      //   return <Transfers />
    }
  }

  const renderContent = () => {
    switch (activeTab2) {
      case 'Code':
        return <ContractCode contractName={contract.hash} closingConditions={contract.closingConditions} />;
      case 'Read contract':
        return <ReadCode />; // Placeholder for Read Contract Component
      case 'Write contract':
        return <WriteCode />; // Placeholder for Write Contract Component
      default:
        return <div>Select a tab</div>;
    }
  };




  return (
    <div className={styles.containerDetails}>
      <div className={styles.containerWrap}>
        <div className={styles.overview}>
          <h1>Smart Contract Overview </h1>
          <div className={styles.wrap}>
            <p className={styles.label}>Hash </p>
            <p className={styles.value}>{contract.hash}</p>

          </div>
          <div className={styles.wrap}>
            <p className={styles.label}>Total assets </p>
            <p className={styles.value}>{contract.totalAssets}</p>
          </div>
          <div className={styles.wrap}>
            <p className={styles.label}>Transactions </p>
            <p className={styles.value}>{contract.transactions}</p>
          </div>
          <div className={styles.wrap}>
            <p className={styles.label}>Transfers </p>
            <p className={styles.value}>{contract.transfers}</p>
          </div>
          <div className={styles.wrap}>
            <p className={styles.label}>Creator </p>
            <p className={styles.value}>{contract.creator}</p>
          </div>
          <div className={styles.wrap}>
            <p className={styles.label}>Receiver </p>
            <p className={styles.value}>{contract.receiver}</p>
          </div>
          <div className={styles.wrap}>
            <p className={styles.label}>Creation date </p>
            <p className={styles.value}>{contract.creationDate}</p>
          </div>
        </div>
        <div className={styles.events}>
          <h2>Events ({events.length})</h2>
          <table>
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.id.substring(1, 12)}</td>
                  <td>{event.time}</td>
                  <td>{event.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.tabContainer}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        {activeTab === 'Contract' &&

          <div className={styles.searchBar}>
            <FiSearch className={styles.icon} />
            <input
              className={styles.input}
              type="text"
              placeholder="Search code "
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        }
      </div>
      <div className={styles.bottomContainer}>
        {renderTabs()}
      </div>
    </div>
  );
}
