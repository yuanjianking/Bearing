import React, { useState } from 'react';
import type{ SnapshotItem } from '../../types';
import styles from './Snapshot.module.css';

const Snapshot: React.FC = () => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<string>('new-chapter');

  const snapshots: SnapshotItem[] = [
    { id: 'new-chapter', label: '"新章节开始" - 2024年9月12日' },
    { id: 'q2-review', label: '"Q2回顾" - 2024年6月30日' },
    { id: 'spring-reset', label: '"春季重置" - 2024年3月15日' },
    { id: 'year-start', label: '"新年伊始" - 2024年1月1日' },
    { id: 'year-review', label: '"年度回顾" - 2023年12月31日' }
  ];

  const handleSnapshotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSnapshot(e.target.value);
    console.log('选择的快照:', e.target.value);
  };

  return (
    <div className={styles.snapshotSection}>
      <div className={styles.snapshotRow}>
        <div className={styles.snapshotLabel}>当前快照:</div>
        <select
          className={styles.snapshotDropdown}
          value={selectedSnapshot}
          onChange={handleSnapshotChange}
        >
          {snapshots.map((snapshot) => (
            <option key={snapshot.id} value={snapshot.id}>
              {snapshot.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Snapshot;