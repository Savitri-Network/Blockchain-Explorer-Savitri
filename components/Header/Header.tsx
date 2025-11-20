"use client"
import Image from 'next/image';
import styles from '@/styles/Header.module.scss';
import { useContext, useEffect, useState } from 'react';
import { WalletContext } from '@/context/wallet';
import Link from 'next/link';
export default function Header() {
  const { sendToWallet, isWalletInstalled, publicKey } = useContext(WalletContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);

  const handleConnectWallet = () => {
    if (!isWalletInstalled) {
      setIsModalOpen(true);
    } else {
      sendToWallet('CHECK_PK');
      setIsModalOpen(false); 
    }

  };
  useEffect(() => {
    if (publicKey) {
      setIsModalOpen(false);
    }
  }, [publicKey]);

  const handleDropdown = () => {
    setIsDropdown(!isDropdown)
  }
  const handleCloseModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleCloseDropdown = () => {
    setIsDropdown(false);
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src={'/logo_savitri.svg'}
            alt="savitri logo"
            width={53}
            height={48}
          />
        </Link>

      </div>
      <ul className={styles.navLinks}>
        <li><a href="/">Home</a></li>
        <li className={styles.unique} onClick={handleDropdown} >
          Blockchain
          {
            isDropdown &&
            <ul className={styles.dropdown} onMouseLeave={handleCloseDropdown}>
              <li className={styles.dropdownItem}>
                <Link className={styles.dropdownLink} href="/accounts">
                  Wallets
                </Link ></li>
              <li className={styles.dropdownItem}>
                <Link className={styles.dropdownLink} href="/blocks">
                  Blocks
                </Link >
              </li>
              <li className={styles.dropdownItem}>
                <Link className={styles.dropdownLink} href="/nodes">
                  Nodes and Masternodes
                </Link >
              </li>
              <li className={styles.dropdownItem}>
                <Link className={styles.dropdownLink} href="/contracts">
                  Smart contracts
                </Link >
              </li>
              <li className={styles.dropdownItem}>
                <Link className={styles.dropdownLink} href="/transactions">
                  Transactions
                </Link>
              </li>
            </ul>
          }

        </li>
        <li><a href="/knowledge">Knowledge base</a></li>
        <li><a href="/developers">Developers</a></li>
      </ul>
      {publicKey ? (
        <div className={styles.walletInfo}>Wallet({publicKey.substring(0, 8)})</div>
      ) : (
        <button className={styles.walletButton} onClick={handleCloseModal}>
          Connect wallet
        </button>
      )}
      {isModalOpen && <Modal onClose={handleCloseModal} isWalletInstalled={isWalletInstalled} handleConnectWallet={handleConnectWallet} />}

    </nav>

  )
}
interface ModalProps {
  onClose: () => void;
  isWalletInstalled: boolean;
  handleConnectWallet: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose, isWalletInstalled, handleConnectWallet }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          Ikarus Wallet connection
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.terms}>
            By connecting you indicate the acceptance of <a href="#">Terms and Conditions</a>
          </div>
          <div className={styles.button}>
            <button className={styles.connectButton} onClick={handleConnectWallet}>
              Connect wallet
            </button>
          </div>
          {!isWalletInstalled && (
            <p>
              If you haven’t installed Ikarus Wallet extension, please install first, then refresh the page and try again.
              <a target="_blank" href="https://chromewebstore.google.com/detail/ikarus-wallet-extension/ibeojcgdagheidjnbboddfmpdigchhdp?hl=en-GB">Install now</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
