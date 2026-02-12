import React, { useState, useMemo } from 'react';
import {
  FaExchangeAlt,
  FaLock,
  FaDownload,
  FaCamera
} from 'react-icons/fa';
import styles from './Timeline.module.css';
import { useFlowStore } from '../../stores/useFlowStore';
import { useTimelineStore } from '../../stores/useTimelineStore';
import type { TimelineEntry, TimelineMarker } from '../../types/timeline';

const Timeline: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<string>('');
  const [snapshotTip, setSnapshotTip] = useState<string | null>(null);

  // Original saveSnapshot functionality
  const saveSnapshot = useFlowStore((s) => s.saveSnapshot);
  const snapshots = useFlowStore((s) => s.snapshots);
  const loadSnapshot = useFlowStore((s) => s.loadSnapshot);

  // New timeline recording functionality
  const recordSnapshot = useTimelineStore((s) => s.recordSnapshot);
  const entries = useTimelineStore((s) => s.entries);
  const goToEntry = useTimelineStore((s) => s.goToEntry);

  // Check if date is today (supports multiple input formats)
  const isToday = (date: string | number | Date) => {
    const today = new Date().toISOString().split('T')[0]
    const targetDate = new Date(date).toISOString().split('T')[0]
    return targetDate === today
  }

  // Format date for display
  const formatDate = (date: string | number | Date) => {
    return new Date(date).toISOString().split('T')[0]
  }

  // Generate markers using real data
  const markers: TimelineMarker[] = useMemo(() => {
    if (entries.length === 0) {
      return [];
    }

    // Sort by time (newest first)
    const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

    // Calculate position: newest on the right (100%), oldest on the left (0%)
    const maxTime = sortedEntries[0].timestamp;
    const minTime = sortedEntries[sortedEntries.length - 1].timestamp;
    const timeRange = maxTime - minTime;

    return sortedEntries.map((entry, index) => {
      // Group by year-month-day
      const date = new Date(entry.timestamp);
      const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

      // Calculate position percentage
      let position = '50%';
      if (timeRange > 0) {
        const timePosition = ((entry.timestamp - minTime) / timeRange) * 100;
        position = `${Math.min(100, Math.max(0, timePosition))}%`;
      } else {
        position = `${(index / (sortedEntries.length - 1)) * 100}%`;
      }

      return {
        id: entry.id,
        date: dateStr,
        position,
        type: index === 0 ? 'current' : 'past',
        entryId: entry.id,
        data: entry
      };
    });
  }, [entries]);

  // Set default selected marker
  React.useEffect(() => {
    if (markers.length > 0 && !selectedMarker) {
      setSelectedMarker(markers[0].id);
    }
  }, [markers, selectedMarker]);

  const handleMarkerClick = (markerId: string) => {
    setSelectedMarker(markerId);

    const result = goToEntry(markerId);
    if (result) {
      // Load timeline snapshot to canvas
      loadTimelineEntry(result);
      setSnapshotTip(`🕒 Loaded: ${result.title}`);
      setTimeout(() => setSnapshotTip(null), 1500);
    }
  };

  const loadTimelineEntry = (entry: TimelineEntry) => {

    // Otherwise try to find matching snapshot from snapshots
    const snapshotId = findMatchingSnapshotId(entry);
    if (snapshotId) {
      loadSnapshot(snapshotId);
    } else {
      console.warn('No matching snapshot data found');
    }
  };

  const findMatchingSnapshotId = (entry: TimelineEntry): string | null => {
    // Helper function to check if two dates are the same day
    const isSameDay = (date1: Date, date2: Date): boolean => {
      return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    // Find snapshots from the same day
    const matchingSnapshots = snapshots.filter(snap => {
      const snapDate = new Date(snap.createdAt);
      const entryDate = new Date(entry.createdAt);

      return isSameDay(snapDate, entryDate);
    });

    if (matchingSnapshots.length > 0) {
      // Return the latest snapshot of the day
      return matchingSnapshots.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0].id;
    }

    return null;
  };

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'compare':
        handleCompare();
        break;
      case 'seal':
        handleSealChapter();
        break;
      case 'export':
        handleExport();
        break;
      case 'snapshot':
        handleSaveSnapshot();
        break;
    }
  };

  const handleSaveSnapshot = () => {
    // 1. Execute original saveSnapshot functionality
    saveSnapshot();

    // 2. Record to timeline simultaneously
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const title = `Snapshot (${dateStr})`;

    // Call timeline store's record snapshot method
    recordSnapshot(title);

    setSnapshotTip(`📸 Snapshot recorded: ${title}`);
    setTimeout(() => setSnapshotTip(null), 1500);
  };

  const handleExport = () => {
    // Export functionality
    alert(`Export functionality in development. Currently ${entries.length} timeline entries available`);
  };

  const handleCompare = () => {
    if (markers.length < 2) {
      alert('At least two time points are required for comparison');
      return;
    }

    // Comparison functionality to be implemented here
    alert(`Comparison functionality in development. Select two time points to compare`);
  };

  const handleSealChapter = () => {
    // Seal chapter functionality
    alert(`Seal chapter functionality in development. Used to conclude an important chapter`);
  };

  return (
    <div className={styles.timelineSection}>
      {/* Snapshot notification */}
      {snapshotTip && (
        <div className={styles.notification}>
          {snapshotTip}
        </div>
      )}

      <div className={styles.timelineRow}>
        <div className={styles.timelineContent}>
          <div className={styles.timelineTrack}>
            {markers.length === 0 ? (
              <div className={styles.emptyTimeline}>
                No timeline records yet
              </div>
            ) : (
              markers.map((marker) => (
                <div
                  key={marker.id}
                  className={`${styles.timelineMarker} ${styles[marker.type]} ${selectedMarker === marker.id ? styles.selected : ''}`}
                  style={{ left: marker.position }}
                  onClick={() => handleMarkerClick(marker.id)}
                  title={marker.data?.title}
                >
                  <div className={styles.timelineDate}>
                    {isToday(marker.date) ? 'Today' : formatDate(marker.date)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.timelineButtons}>
            <button
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={() => handleButtonClick('compare')}
              disabled={markers.length < 2}
              title="Compare system states at different time points"
            >
              <FaExchangeAlt className={styles.btnIcon} />
              Compare
            </button>

            {/* Record snapshot button - executes both functions simultaneously */}
            <button
              className={`${styles.btn} ${styles.btnSave}`}
              onClick={() => handleButtonClick('snapshot')}
              title="Record snapshot to timeline and save system state"
            >
              <FaCamera className={styles.btnIcon} />
              Record Snapshot
            </button>

            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => handleButtonClick('seal')}
              title="Conclude a complete chapter"
            >
              <FaLock className={styles.btnIcon} />
              Seal Chapter
            </button>

            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => handleButtonClick('export')}
              title="Export timeline data"
            >
              <FaDownload className={styles.btnIcon} />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;