import React, { useState } from 'react';
import { FaExchangeAlt , FaLock, FaDownload } from 'react-icons/fa';
import type  { TimelineMarker } from '../../types';
import styles from './Timeline.module.css';

const Timeline: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<string>('2024-09');

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
    alert(`执行操作: ${action}`);
  };

  return (
    <div className={styles.timelineSection}>
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