import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.contactInfo}>
        <p>+7 (778) 816-67-37</p>
        <p>+7 (705) 612-69-05</p>
        <a href="mailto:info@prometeochain.io">info@prometeochain.io</a>
        <a href="mailto:work@prometeochain.io">work@prometeochain.io</a>
      </div>
      <div className={styles.socialIcons}>
        <Link href="https://twitter.com/Prometeochain" target='_blank'>
          <Image src={'/twitter.svg'} height={24} width={24} alt='icon' />
        </Link>
        <Link href="https://www.facebook.com/prometeochain" target='_blank'>
          <Image src={'/facebook.svg'} height={24} width={24} alt='icon' />
        </Link>
        <Link href="https://www.instagram.com/prometeochain" target='_blank'>
          <Image src={'/instagram.svg'} height={24} width={24} alt='icon' />
        </Link>
        <Link href="https://www.linkedin.com/company/prometeochain" target='_blank'>
          <Image src={'/linkedin.svg'} height={24} width={24} alt='icon' />
        </Link>
        <Link href="https://github.com/Prometeochainsystem" target='_blank'>
          <Image src={'/github.svg'} height={24} width={24} alt='icon' />
        </Link>
        <Link href="https://medium.com/@prometeochainsystem" target='_blank'>
          <Image src={'/medium.svg'} height={24} width={24} alt='icon' />
        </Link>
        <Link href="https://www.youtube.com/channel/UC7c_LAmGnsc_wrt2j_9gWGw" target='_blank'>
          <Image src={'/youtube.svg'} height={24} width={24} alt='icon' />
        </Link>
        <Link href="https://t.me/prometeochain" target='_blank'>
          <Image src={'/telegram.svg'} height={24} width={24} alt='icon' />
        </Link>
        <Link href="https://discord.com/invite/abawfaNKBz" target='_blank'>
          <Image src={'/discord.svg'} height={24} width={24} alt='icon' />
        </Link>
      </div>
      <div className={styles.legalLinks}>
        <a href="/privacy-policy" className={styles.purple}>Privacy Policy</a>
        <a href="/terms-of-service" className={styles.purple}>Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;