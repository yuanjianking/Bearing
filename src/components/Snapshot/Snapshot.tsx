import React, { useState } from 'react';
import { useFlowStore } from '../../stores/useFlowStore';
import styles from './Snapshot.module.css';
import { useStructureStore } from '../../stores/useStructureStore';

const Snapshot: React.FC = () => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<string>('');

  // Get snapshot data and methods from store
  const snapshots = useStructureStore((s) => s.snapshots);
  const loadSnapshot = useFlowStore((s) => s.loadSnapshot);

  // Format time display
  const formatSnapshotTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();

    const isSameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      d.getFullYear() === yesterday.getFullYear() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getDate() === yesterday.getDate();

    if (isSameDay) {
      return `Today`;
    }

    if (isYesterday) {
      return `Yesterday`;
    }

    const date = d.toLocaleDateString([], {
      month: '2-digit',
      day: '2-digit',
    });

    return `${date}`;
  };

  // Handle snapshot selection
  const handleSnapshotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const snapshotId = e.target.value;
    if (snapshotId) {
      setSelectedSnapshot(snapshotId);
      loadSnapshot(snapshotId);
      console.log('Load snapshot:', snapshotId);
    }
  };

  // Select the latest snapshot by default if snapshots exist
  React.useEffect(() => {
    if (snapshots.length > 0 && !selectedSnapshot) {
      const latestSnapshot = snapshots[snapshots.length - 1];
      setSelectedSnapshot(latestSnapshot.id.toString());
    }
  }, [snapshots, selectedSnapshot]);

  return (
    <div className={styles.snapshotSection}>
      <div className={styles.snapshotRow}>
        <div className={styles.snapshotLabel}>Current Snapshot:</div>
        <select
          className={styles.snapshotDropdown}
          value={selectedSnapshot}
          onChange={handleSnapshotChange}
        >
          {snapshots.length === 0 ? (
            <option value="">No snapshots</option>
          ) : (
            snapshots.slice().reverse().map((snapshot) => (
              <option key={snapshot.id} value={snapshot.id.toString()}>
                {formatSnapshotTime(snapshot.createdAt)} - {snapshot.structure.nodes.length} nodes
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
};

export default Snapshot;