import React from 'react';
import { FaSitemap } from 'react-icons/fa';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <FaSitemap className={styles.logoIcon} />
        <h1>承重</h1>
      </div>
    </div>
  );
};

export default Header;