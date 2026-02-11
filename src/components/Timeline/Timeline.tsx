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

  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);

  // 原有的 saveSnapshot 功能
  const saveSnapshot = useFlowStore((s) => s.saveSnapshot);
  const snapshots = useFlowStore((s) => s.snapshots);
  const loadSnapshot = useFlowStore((s) => s.loadSnapshot);
  const initializeWithData = useFlowStore((s) => s.initializeWithData);
  const setSelectedId = useFlowStore((s) => s.setSelectedId);

  // 新的时间轴记录功能
  const recordSnapshot = useTimelineStore((s) => s.recordSnapshot);
  const entries = useTimelineStore((s) => s.entries);
  const goToEntry = useTimelineStore((s) => s.goToEntry);

  // 使用真实数据生成标记点
  const markers: TimelineMarker[] = useMemo(() => {
    if (entries.length === 0) {
      return [];
    }

    // 按时间排序（最新的在前面）
    const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

    // 计算位置：最新的在右边（100%），最旧的在左边（0%）
    const maxTime = sortedEntries[0].timestamp;
    const minTime = sortedEntries[sortedEntries.length - 1].timestamp;
    const timeRange = maxTime - minTime;

    return sortedEntries.map((entry, index) => {
      const date = new Date(entry.timestamp);
      const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      // 计算位置百分比
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

  // 设置默认选中的标记点
  React.useEffect(() => {
    if (markers.length > 0 && !selectedMarker) {
      setSelectedMarker(markers[0].id);
    }
  }, [markers, selectedMarker]);

  const handleMarkerClick = (markerId: string) => {
    setSelectedMarker(markerId);

    const result = goToEntry(markerId);
    if (result) {
      // 加载时间轴快照到画布
      loadTimelineEntry(result);
      setSnapshotTip(`🕒 已加载: ${result.title}`);
      setTimeout(() => setSnapshotTip(null), 1500);
    }
  };

  const loadTimelineEntry = (entry: TimelineEntry) => {
    // 如果 entry 有完整的 nodes 和 edges 数据，直接使用
    if (entry.nodes && entry.edges) {
      initializeWithData(entry.nodes, entry.edges);
      setSelectedId(null);
      return;
    }

    // 否则尝试从 snapshots 中查找匹配的快照
    const snapshotId = findMatchingSnapshotId(entry);
    if (snapshotId) {
      loadSnapshot(snapshotId);
    } else {
      console.warn('未找到对应的快照数据');
    }
  };

  const findMatchingSnapshotId = (entry: TimelineEntry): number | null => {
    // 根据时间戳查找最接近的快照
    const matchingSnapshots = snapshots.filter(snap => {
      const snapDate = new Date(snap.createdAt);
      const entryDate = new Date(entry.timestamp || entry.createdAt);

      // 时间差在5秒内认为是同一个快照
      const timeDiff = Math.abs(snapDate.getTime() - entryDate.getTime());
      return timeDiff < 5000;
    });

    if (matchingSnapshots.length > 0) {
      // 返回时间最接近的快照
      return matchingSnapshots.sort((a, b) => {
        const aDiff = Math.abs(new Date(a.createdAt).getTime() - (entry.timestamp || new Date(entry.createdAt).getTime()));
        const bDiff = Math.abs(new Date(b.createdAt).getTime() - (entry.timestamp || new Date(entry.createdAt).getTime()));
        return aDiff - bDiff;
      })[0].id;
    }

    // 如果没找到时间匹配的快照，尝试查找内容匹配的
    for (const snap of snapshots) {
      if (snap.nodes.length === entry.metrics?.nodeCount &&
          snap.edges.length === entry.metrics?.edgeCount) {
        return snap.id;
      }
    }

    return null;
  };

  const handleButtonClick = (action: string) => {
    switch (action) {
      case '比较':
        handleCompare();
        break;
      case '封章':
        handleSealChapter();
        break;
      case '导出数据':
        handleExport();
        break;
      case '记录快照':
        handleSaveSnapshot();
        break;
    }
  };

  const handleSaveSnapshot = () => {
    // 1. 执行原有的 saveSnapshot 功能
    saveSnapshot();

    // 2. 同时记录到时间轴
    const snapshotCount = entries.filter(e => e.action === 'snapshot').length + 1;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const title = `快照${snapshotCount} (${timeStr})`;

    // 自动生成描述：系统状态概览
    const description = `系统状态: ${nodes.length}个节点, ${edges.length}个连接`;

    // 调用时间轴 store 的记录快照方法
    recordSnapshot(title, description, nodes, edges);

    setSnapshotTip(`📸 快照已记录: ${title}`);
    setTimeout(() => setSnapshotTip(null), 1500);
  };

  const handleExport = () => {
    // 导出功能
    alert(`导出功能开发中，当前有 ${entries.length} 条时间轴记录`);
  };

  const handleCompare = () => {
    if (markers.length < 2) {
      alert('至少需要两个时间点才能比较');
      return;
    }

    // 这里可以实现比较功能
    alert(`比较功能开发中，可以选择两个时间点进行对比`);
  };

  const handleSealChapter = () => {
    // 封章功能
    alert(`封章功能开发中，用于结束一个重要章节`);
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
            {markers.length === 0 ? (
              <div className={styles.emptyTimeline}>
                暂无时间轴记录
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
                  <div className={styles.timelineDate}>{marker.date}</div>
                </div>
              ))
            )}
          </div>

          <div className={styles.timelineButtons}>
            <button
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={() => handleButtonClick('比较')}
              disabled={markers.length < 2}
              title="比较不同时间点的系统状态"
            >
              <FaExchangeAlt className={styles.btnIcon} />
              比较
            </button>

            {/* 记录快照按钮 - 同时执行两个功能 */}
            <button
              className={`${styles.btn} ${styles.btnSave}`}
              onClick={() => handleButtonClick('记录快照')}
              title="记录快照到时间轴并保存系统状态"
            >
              <FaCamera className={styles.btnIcon} />
              记录快照
            </button>

            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => handleButtonClick('封章')}
              title="结束一个完整章节"
            >
              <FaLock className={styles.btnIcon} />
              封章
            </button>

            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => handleButtonClick('导出数据')}
              title="导出时间轴数据"
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