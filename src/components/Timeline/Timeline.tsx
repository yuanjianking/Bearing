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
import { useStructureStore } from '../../stores/useStructureStore';

const Timeline: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<string>('');
  const [snapshotTip, setSnapshotTip] = useState<string | null>(null);

  // Original saveSnapshot functionality
  const saveSnapshot = useFlowStore((s) => s.saveSnapshot);
  const setSelectedId = useFlowStore((s) => s.setSelectedId);
  const currentStructureId = useStructureStore((s) => s.currentStructureId);
  const viewingStructureId = useStructureStore((s) => s.viewingStructureId);
  const isViewingHistory = useStructureStore((s) => s.isViewingHistory);
  const snapshots = useStructureStore((s) => s.snapshots);
  const pastJourneys = useStructureStore((s) => s.pastJourneys);
  const sealedChapters = useStructureStore((s) => s.SealedChapters);
  const hasCurrentStructure = useStructureStore((s) => s.hasCurrentStructure);
  const currentStructure = useStructureStore((s) => s.getCurrentStructure());
  const saveSealedChapter = useStructureStore((s) => s.saveSealedChapter);
  const initializeWithData = useFlowStore((s) => s.initializeWithData);

  // New timeline recording functionality
  const recordSnapshot = useTimelineStore((s) => s.recordSnapshot);
  const recordSealChapter = useTimelineStore((s) => s.recordSealChapter);
  const entries = useTimelineStore((s) => s.entries);
  const goToEntry = useTimelineStore((s) => s.goToEntry);

  const targetStructureId = isViewingHistory ? viewingStructureId : currentStructureId;

  const allTimelineEntries = useMemo(() => {
    if (!targetStructureId) return [];

    // 直接从 entries 中过滤，entries 已经包含了所有类型的时间线数据
    return entries
      .filter(entry => entry.targetStructureId === targetStructureId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [entries, targetStructureId]);

  const timeRange = useMemo(() => {
    if (allTimelineEntries.length === 0) return null;
    const maxTime = allTimelineEntries[0].timestamp;
    const minTime = allTimelineEntries[allTimelineEntries.length - 1].timestamp;
    return { maxTime, minTime, range: maxTime - minTime };
  }, [allTimelineEntries]);

  const markers: TimelineMarker[] = useMemo(() => {
    if (allTimelineEntries.length === 0 || !timeRange) return [];

    return allTimelineEntries.map((entry, index) => {
      const date = new Date(entry.createdAt);
      const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

      let position = '50%';
      if (timeRange.range > 0) {
        const timePosition = ((entry.timestamp - timeRange.minTime) / timeRange.range) * 100;
        position = `${Math.min(100, Math.max(0, timePosition))}%`;
      } else {
        position = `${(index / (allTimelineEntries.length - 1)) * 100}%`;
      }

      // 根据 entry.action 判断条目类型
      let entryType: 'snapshot' | 'journey' | 'chapter' = 'snapshot';

      if (entry.action === 'journey') {
        entryType = 'journey';
      } else if (entry.action === 'chapter') {
        entryType = 'chapter';
      }

      return {
        id: entry.id,
        date: dateStr,
        position,
        type: index === 0 ? 'current' : 'past',
        entryType,
        entryId: entry.id,
        data: entry // 直接使用 entry，它已经是 TimelineEntry 类型
      };
    });
  }, [allTimelineEntries, timeRange]);

  // Set default selected marker
  React.useEffect(() => {
    if (markers.length > 0 && !selectedMarker) {
      setSelectedMarker(markers[0].id);
    }
  }, [markers, selectedMarker]);


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
    const targetStructureId = entry.targetStructureId;

    // 根据 action 类型从对应的存储中查找
    let structureData = null;

    switch (entry.action) {
      case 'snapshot':
        structureData = snapshots.find(s => s.id === targetStructureId);
        break;
      case 'journey': // past journey
        structureData = pastJourneys.find(j => j.id === targetStructureId);
        break;
      case 'chapter': // sealed chapter
        structureData = sealedChapters.find(c => c.id === targetStructureId);
        break;
      default:
        console.warn('Unknown entry action:', entry.action);
        return;
    }

    if (structureData) {
      initializeWithData(structureData.structure.nodes, structureData.structure.edges);
      setSelectedId(null);
    } else {
      console.warn('No matching structure data found for entry:', entry.id);
    }
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
    if (currentStructureId){
      recordSnapshot(currentStructureId,title);
    }

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
    if (hasCurrentStructure() && currentStructure) {
      // Save current structure as Sealed Chapter before switching
      saveSealedChapter();
      //Record to timeline simultaneously
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const title = `Sealed Chapter (${dateStr})`;

      // Call timeline store's record seal chapter method
      if (currentStructureId){
      recordSealChapter(currentStructureId, title);
      }
    }
    // Clear canvas
    initializeWithData([], []);

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