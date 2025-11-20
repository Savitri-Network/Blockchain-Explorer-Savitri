import Link from 'next/link'
import styles from '@/styles/NotFound.module.scss'


export default function NotFound() {


  return (
    <div className={styles.container}>
      <div className={styles.copyContainer} >
        <p>
          404, page not found.
        </p>
      </div>
    </div>
  );
};
