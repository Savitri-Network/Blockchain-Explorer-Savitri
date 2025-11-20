import styles from '@/styles/SmartContractDetails.module.scss'
import Image from 'next/image';
export const ReadCode = () => {
  return (
    <div className={styles.readCodeContainer}>
      <div className={styles.header}>
        <p>
          Expand
        </p>
        <p>
          Reset
        </p>
      </div>
      <div className={styles.readContent}>
        <div className={styles.item}>
          <div className={styles.label}>1. name (06fdde03)</div>
          <div className={styles.right}>
            <Image src={'/copy.svg'}
              alt='icon'
              width={18}
              height={18}
            />
            <Image src={'/link.svg'}
              alt='icon'
              width={18}
              height={18}
            />
            <Image src={'/compress.svg'}
              alt='icon'
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>2. deprecated (0e136b19)</div>
          <div className={styles.right}>
            <Image src={'/copy.svg'}
              alt='icon'
              width={18}
              height={18}
            />
            <Image src={'/link.svg'}
              alt='icon'
              width={18}
              height={18}
            />
            <Image src={'/compress.svg'}
              alt='icon'
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>3. upgradedAddress (26976e3f)</div>
          <div className={styles.right}>
            <Image src={'/copy.svg'}
              alt='icon'
              width={18}
              height={18}
            />
            <Image src={'/link.svg'}
              alt='icon'
              width={18}
              height={18}
            />
            <Image src={'/compress.svg'}
              alt='icon'
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>4. decimals (313ce567)</div>
          <div className={styles.right}>
            <Image src={'/copy.svg'}
              alt='icon'
              width={18}
              height={18}
            />
            <Image src={'/link.svg'}
              alt='icon'
              width={18}
              height={18}
            />
            <Image src={'/compress.svg'}
              alt='icon'
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
    </div>

  );
}