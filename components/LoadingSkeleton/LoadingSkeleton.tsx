import React from 'react'
import styles from '@/styles/LoadSkeleton.module.scss'

const LoadingSkeleton = () => {
  return (
    <div className={styles.loadBody}>
      <div className={styles.loader}></div>
    </div>

  )
}

export default LoadingSkeleton