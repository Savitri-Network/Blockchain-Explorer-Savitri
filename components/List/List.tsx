import React from 'react'
import styles from '../../styles/List.module.scss'
import TransactionList from './TransactionList/TransactionList'
import BLockList from './BlockList/BLockList'

const List = () => {
  return (
    <div className={styles.list_container}>
      <BLockList  />
      <TransactionList />
    </div>
  )
}

export default List