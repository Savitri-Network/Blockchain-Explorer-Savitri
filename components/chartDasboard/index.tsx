import React from 'react'
import styles from '@/styles/ChartDashboard.module.scss'
import DashboardCards from './CardDashboard'
import ActiveUsersChart from './ActiveUserChar'
import TransactionChart from './TrabsactionBarChart'
import BlocksChart from './BlockBarChart'

const ChatDashboard = () => {
  return (
    <div className={styles.container_dashboard}>

      <DashboardCards />
      <div className={styles.graph}>
        <ActiveUsersChart />
      </div>
      <div className={styles.graph}>
        <BlocksChart />
      </div>
      <div className={styles.graph}>
        <TransactionChart />
      </div>
    </div>
  )
}

export default ChatDashboard