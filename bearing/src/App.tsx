import React from 'react';
import Header from './components/Header/Header';
import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import RightPanel from './components/RightPanel/RightPanel';
import Snapshot from './components/Snapshot/Snapshot';
import Timeline from './components/Timeline/Timeline';
import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <div className={styles.container}>
        <Header />

        <div className={styles.content}>
          <LeftPanel />
          <CenterPanel />
          <RightPanel />
        </div>

        <div className={styles.bottomSections}>
          <Snapshot />
          <Timeline />
        </div>
      </div>
    </div>
  );
};

export default App;