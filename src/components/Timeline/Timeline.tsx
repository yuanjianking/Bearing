import React, { useState } from 'react';
import {
  FaExchangeAlt,
  FaLock,
  FaDownload,
  FaCamera
} from 'react-icons/fa';
import type { TimelineMarker } from '../../types';
import styles from './Timeline.module.css';
import { useFlowStore } from '../../stores/useFlowStore';

const Timeline: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<string>('2024-09');
  const [snapshotTip, setSnapshotTip] = useState<string | null>(null);
  const saveSnapshot = useFlowStore((s) => s.saveSnapshot);

  const markers: TimelineMarker[] = [
    { id: '2018-03', date: '2018-03', position: '0%', type: 'past' },
    { id: '2019-06', date: '2019-06', position: '20%', type: 'past' },
    { id: '2020-09', date: '2020-09', position: '40%', type: 'past' },
    { id: '2022-01', date: '2022-01', position: '60%', type: 'past' },
    { id: '2024-09', date: '2024-09', position: '80%', type: 'current' },
    { id: '2025-12', date: '2025-12', position: '100%', type: 'future' }
  ];

  const handleMarkerClick = (markerId: string) => {
    setSelectedMarker(markerId);
    console.log('选择时间点:', markerId);
  };

  const handleButtonClick = (action: string) => {
    switch (action) {
      case '比较':
        alert(`执行操作: ${action}`);
        break;
      case '封存结构':
        alert(`执行操作: ${action}`);
        break;
      case '导出数据':
        alert(`执行操作: ${action}`);
        break;
      case '记录快照':
        handleSaveSnapshot();
        break;
    }
  };

  const handleSaveSnapshot = () => {
    saveSnapshot();
    setSnapshotTip('✅ 快照已记录');
    setTimeout(() => setSnapshotTip(null), 1500);
  };

  return (
    <div className={styles.timelineSection}>
      {/* 快照通知 */}
      {snapshotTip && (
        <div className={styles.notification}>
          {snapshotTip}
        </div>
      )}

      <div className={styles.timelineRow}>
        <div className={styles.timelineContent}>
          <div className={styles.timelineTrack}>
            {markers.map((marker) => (
              <div
                key={marker.id}
                className={`${styles.timelineMarker} ${styles[marker.type]} ${selectedMarker === marker.id ? styles.selected : ''}`}
                style={{ left: marker.position }}
                onClick={() => handleMarkerClick(marker.id)}
              >
                <div className={styles.timelineDate}>{marker.date}</div>
              </div>
            ))}
          </div>

          <div className={styles.timelineButtons}>
            <button
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={() => handleButtonClick('比较')}
            >
              <FaExchangeAlt className={styles.btnIcon} />
              比较
            </button>

            {/* 记录快照按钮 */}
            <button
              className={`${styles.btn} ${styles.btnSave}`}
              onClick={() => handleButtonClick('记录快照')}
            >
              <FaCamera className={styles.btnIcon} />
              记录快照
            </button>

            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => handleButtonClick('封存结构')}
            >
              <FaLock className={styles.btnIcon} />
              封存结构
            </button>

            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => handleButtonClick('导出数据')}
            >
              <FaDownload className={styles.btnIcon} />
              导出数据
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;