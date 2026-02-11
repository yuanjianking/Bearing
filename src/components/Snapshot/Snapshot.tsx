import React, { useState } from 'react';
import { useFlowStore } from '../../stores/useFlowStore';
import styles from './Snapshot.module.css';

const Snapshot: React.FC = () => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<string>('');

  // 从store中获取快照数据和方法
  const snapshots = useFlowStore((s) => s.snapshots);
  const loadSnapshot = useFlowStore((s) => s.loadSnapshot);

  // 格式化时间显示
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
      return `今日`;
    }

    if (isYesterday) {
      return `昨天 `;
    }

    const date = d.toLocaleDateString([], {
      month: '2-digit',
      day: '2-digit',
    });

    return `${date}`;
  };

  // 处理快照选择
  const handleSnapshotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const snapshotId = parseInt(e.target.value);
    if (!isNaN(snapshotId)) {
      setSelectedSnapshot(e.target.value);
      loadSnapshot(snapshotId);
      console.log('加载快照:', snapshotId);
    }
  };

  // 如果有快照，默认选中最新的
  React.useEffect(() => {
    if (snapshots.length > 0 && !selectedSnapshot) {
      const latestSnapshot = snapshots[snapshots.length - 1];
      setSelectedSnapshot(latestSnapshot.id.toString());
    }
  }, [snapshots, selectedSnapshot]);

  return (
    <div className={styles.snapshotSection}>
      <div className={styles.snapshotRow}>
        <div className={styles.snapshotLabel}>当前快照:</div>
        <select
          className={styles.snapshotDropdown}
          value={selectedSnapshot}
          onChange={handleSnapshotChange}
        >
          {snapshots.length === 0 ? (
            <option value="">暂无快照</option>
          ) : (
            snapshots.slice().reverse().map((snapshot) => (
              <option key={snapshot.id} value={snapshot.id.toString()}>
                {formatSnapshotTime(snapshot.createdAt)} - {snapshot.nodes.length}个节点
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
};

export default Snapshot;