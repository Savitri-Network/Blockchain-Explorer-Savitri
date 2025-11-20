import styles from '@/styles/SmartContractDetails.module.scss'

import Image from 'next/image'

export const WriteCode = () => {
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
          <div className={styles.label}>1. addBlackList (0ecb93c0)</div>
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
          <div className={styles.label}>2. unpause (3f4ba83a)</div>
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
          <div className={styles.label}>3. pause (8456cb59)</div>
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
          <div className={styles.label}>4. setParams (c0324c77)</div>
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