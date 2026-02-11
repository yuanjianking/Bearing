import React, { useState } from 'react';
import {
  FaBullseye,
  FaExchangeAlt,
  FaCalendarAlt,
  FaChevronDown,
  FaArchive,
  FaHistory,
  FaLock,
  FaCircle,
  FaPlus,
  FaSync
} from 'react-icons/fa';
import type{ StructureItem, StatItem, StructureContent, PastJourney, SnapshotArchive, SealedChapter, CurrentStructure } from '../../types';
import styles from './LeftPanel.module.css';

const LeftPanel: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Current structure state management
  const [currentStructure, setCurrentStructure] = useState<{
    exists: boolean;
    name?: string;
    created?: string;
    nodes?: number;
  }>({
    exists: false // Initial state: no structure
  });

  // Past journeys state management
  const [pastJourneys, setPastJourneys] = useState<string[]>([]);

  const structureItems: StructureItem[] = [
    {
      id: 'current-structure',
      label: 'Current Structure',
      content: currentStructure
    },
    {
      id: 'snapshot-archive',
      label: 'Snapshot Archive',
      content: {
        count: '27 snapshots',
        recent: '"New Chapter Started" - Sep 12, 2024',
        earliest: '"Initial Structure" - Mar 10, 2018',
        autoSave: 'Weekly automatic snapshots',
        milestones: 'Career transition in 2020, Health plan launch in 2022, Creative project start in 2024'
      }
    },
    {
      id: 'past-journeys',
      label: 'Past Journeys',
      content: {
        span: pastJourneys.length > 0
          ? `${pastJourneys[0].split('：')[0]} to present`
          : 'No journeys yet',
        stages: pastJourneys,
        turningPoints: 'To be added'
      }
    },
    {
      id: 'sealed-chapters',
      label: 'Sealed Chapters',
      content: {
        count: '5 chapters',
        reasons: JSON.stringify([
          'Student Life System (Sealed in 2020)',
          'Entrepreneurship Attempt Structure (Sealed in 2022)',
          'Health Challenge Plan (Sealed in 2023)'
        ]),
        time: 'Longest sealed for 4 years, shortest for 1 year',
        note: 'Sealed chapters are read-only, can be viewed but not edited'
      }
    }
  ];

  const stats: StatItem[] = [
    { label: 'Active Nodes', value: currentStructure.nodes?.toString() || '0' },
    { label: 'Recent Changes', value: '0' },
    { label: 'Years in Use', value: currentStructure.exists ? '1' : '0' }
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  // Handle switching to new structure
  const handleSwitchToNewStructure = () => {
    setShowConfirmDialog(true);
  };

  // Confirm creation of new structure
  const confirmNewStructure = () => {
    // 1. If current structure exists, automatically seal it as Past Journey
    if (currentStructure.exists) {
      const archiveEntry = `${currentStructure.name || 'Unnamed Structure'} (${currentStructure.created || 'Unknown time'})`;
      setPastJourneys(prev => [archiveEntry, ...prev]);
      // TODO: Actual sealing logic - move current structure to sealed chapters
    }

    // 2. Create new structure - empty structure initial state
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    setCurrentStructure({
      exists: true,
      name: 'New Structure',
      created: dateStr,
      nodes: 0
    });

    // 3. Close dialog
    setShowConfirmDialog(false);
    setActiveItem(null); // Collapse current structure panel
  };

  // Cancel creation
  const cancelNewStructure = () => {
    setShowConfirmDialog(false);
  };

  // Handle start structure
  const handleStartStructure = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    setCurrentStructure({
      exists: true,
      name: 'My Structure',
      created: dateStr,
      nodes: 0
    });
    setActiveItem(null);
  };

  // Type guard functions
  const isPastJourney = (content: StructureContent): content is PastJourney => {
    return 'span' in content && 'stages' in content;
  };

  const isSnapshotArchive = (content: StructureContent): content is SnapshotArchive => {
    return 'count' in content && 'recent' in content;
  };

  const isSealedChapter = (content: StructureContent): content is SealedChapter => {
    return 'reasons' in content && 'time' in content;
  };

  const isCurrentStructure = (content: StructureContent): content is CurrentStructure => {
    return 'exists' in content;
  };

  const renderContent = (item: StructureItem) => {
    const content = item.content;

    if (isCurrentStructure(content)) {
      return (
        <div className={styles.currentStructureContent}>
          {content.exists ? (
            <>
              <div className={styles.structureInfo}>
                <p><strong>Structure Name:</strong> {content.name || 'Unnamed'}</p>
                <p><strong>Created:</strong> {content.created || 'Unknown'}</p>
                <p><strong>Node Count:</strong> {content.nodes || 0} active nodes</p>
                <p><strong>Status:</strong> Active</p>
              </div>

              <button
                className={styles.switchButton}
                onClick={handleSwitchToNewStructure}
              >
                <FaSync className={styles.buttonIcon} />
                Switch to New Structure
              </button>
            </>
          ) : (
            <button
              className={styles.startButton}
              onClick={handleStartStructure}
            >
              <FaPlus className={styles.buttonIcon} />
              Start a Structure
            </button>
          )}
        </div>
      );
    }

    if (isPastJourney(content)) {
      return (
        <div>
          <p><strong>Journey Span:</strong> {content.span}</p>
          <p><strong>Main Stages:</strong></p>
          {content.stages.length > 0 ? (
            <ul>
              {content.stages.map((stage: string, index: number) => (
                <li key={index}>{stage}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>No past journeys yet</p>
          )}
          <p><strong>Key Turning Points:</strong> {content.turningPoints}</p>
        </div>
      );
    }

    if (isSnapshotArchive(content)) {
      return (
        <div>
          <p><strong>Archive Count:</strong> {content.count}</p>
          <p><strong>Most Recent Snapshot:</strong> {content.recent}</p>
          <p><strong>Earliest Snapshot:</strong> {content.earliest}</p>
          <p><strong>Auto Archive:</strong> {content.autoSave}</p>
          <p><strong>Key Milestones:</strong> {content.milestones}</p>
        </div>
      );
    }

    if (isSealedChapter(content)) {
      const reasons = JSON.parse(content.reasons);
      return (
        <div>
          <p><strong>Sealed Count:</strong> {content.count}</p>
          <p><strong>Sealing Reasons:</strong></p>
          <ul>
            {reasons.map((reason: string, index: number) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
          <p><strong>Sealed Duration:</strong> {content.time}</p>
          <p><strong>Note:</strong> {content.note}</p>
        </div>
      );
    }

    return null;
  };

  const getIcon = (itemId: string) => {
    switch (itemId) {
      case 'current-structure': return <FaCircle />;
      case 'snapshot-archive': return <FaArchive />;
      case 'past-journeys': return <FaHistory />;
      case 'sealed-chapters': return <FaLock />;
      default: return <FaCircle />;
    }
  };

  return (
    <div className={`${styles.leftPanel} ${styles.panel}`}>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className={styles.confirmDialogOverlay}>
          <div className={styles.confirmDialog}>
            <h3>Are you entering a new life structure?</h3>
            <p className={styles.dialogSubtext}>
              This will define what you are building now.
            </p>
            <div className={styles.dialogActions}>
              <button
                className={styles.confirmButton}
                onClick={confirmNewStructure}
              >
                Confirm
              </button>
              <button
                className={styles.cancelButton}
                onClick={cancelNewStructure}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ul className={styles.structureList}>
        {structureItems.map((item) => (
          <React.Fragment key={item.id}>
            <li
              className={`${styles.structureItem} ${activeItem === item.id ? styles.active : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span>{item.label}</span>
              <div className={styles.iconContainer}>
                {getIcon(item.id)}
                <FaChevronDown className={`${styles.chevron} ${activeItem === item.id ? styles.rotated : ''}`} />
              </div>
            </li>
            {activeItem === item.id && (
              <div className={styles.structureContent}>
                {renderContent(item)}
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>

      <div className={styles.questionBox}>
        <div className={styles.questionText}>
          {currentStructure.exists
            ? "Have I built the right structure for my current stage?"
            : "Ready to build your first life structure?"}
        </div>
        <div className={styles.questionNote}>
          This is the core question you've reflected on over the past 7 years
        </div>
      </div>

      <div className={styles.statsVerticalContainer}>
        {stats.map((stat, index) => (
          <div className={styles.statVerticalItem} key={index}>
            <div className={styles.statVerticalLabel}>
              {index === 0 && <FaBullseye />}
              {index === 1 && <FaExchangeAlt />}
              {index === 2 && <FaCalendarAlt />}
              <span>{stat.label}</span>
            </div>
            <div className={styles.statVerticalValue}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;