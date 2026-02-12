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

import styles from './LeftPanel.module.css';
import { useStructureStore } from '../../stores/useStructureStore';
import { useFlowStore } from '../../stores/useFlowStore';

const LeftPanel: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [newStructureName, setNewStructureName] = useState('');


  const structures = useStructureStore((s) => s.structures);
  const currentStructureId = useStructureStore((s) => s.currentStructureId);
  const createStructure = useStructureStore((s) => s.createStructure);
  const hasCurrentStructure = useStructureStore((s) => s.hasCurrentStructure);
  const snapshots = useStructureStore((s) => s.snapshots);

  const currentStructure = structures.find(s => s.id === currentStructureId);

  const initializeWithData = useFlowStore((s) => s.initializeWithData);

  // Past journeys state management
  const [pastJourneys, setPastJourneys] = useState<string[]>([]);



  const getEarliestStructureDate = () => {
    if (structures.length === 0) return null;

    const earliest = structures.reduce((earliest, current) => {
      return new Date(current.createdAt) < new Date(earliest.createdAt) ? current : earliest;
    });

    return new Date(earliest.createdAt);
  };


  const getYearsInUse = () => {
    if (structures.length === 0) return '0';

    const earliestDate = getEarliestStructureDate();
    if (!earliestDate) return '0';

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - earliestDate.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);


    return Math.max(1, Math.ceil(diffYears)).toString();
  };


  const getRecentChanges = () => {
    if (!currentStructure) return '0';

    // 找到上一次快照
    const lastSnapshot = snapshots
      .filter(snap => snap.structure.id === currentStructure.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (!lastSnapshot) return '0';

    const previousStructure = lastSnapshot.structure;
    const currentNodes = currentStructure.nodes;
    const currentEdges = currentStructure.edges;
    const previousNodes = previousStructure.nodes;
    const previousEdges = previousStructure.edges;

    let changes = 0;

    // 1. 新增 Node
    const addedNodes = currentNodes.filter(
      node => !previousNodes.some(p => p.id === node.id)
    );
    changes += addedNodes.length;

    // 2. 删除 Node
    const deletedNodes = previousNodes.filter(
      node => !currentNodes.some(c => c.id === node.id)
    );
    changes += deletedNodes.length;

    // 3. Node 层级移动
    const movedNodes = currentNodes.filter(node => {
      const prevNode = previousNodes.find(p => p.id === node.id);
      return prevNode && prevNode.data.layer !== node.data.layer;
    });
    changes += movedNodes.length;

    // 4. 新建承重关系
    const addedEdges = currentEdges.filter(
      edge => !previousEdges.some(p => p.id === edge.id)
    );
    changes += addedEdges.length;

    // 5. 删除承重关系
    const deletedEdges = previousEdges.filter(
      edge => !currentEdges.some(c => c.id === edge.id)
    );
    changes += deletedEdges.length;

    // 6. 改变承重方向
    const reversedEdges = currentEdges.filter(edge => {
      const prevEdge = previousEdges.find(p => p.id === edge.id);
      return prevEdge && (
        prevEdge.source !== edge.source ||
        prevEdge.target !== edge.target
      );
    });
    changes += reversedEdges.length;

    return changes.toString();
  };


  const stats = [
    { label: 'Active Nodes', value: currentStructure?.nodes.length.toString() || '0' },
    { label: 'Recent Changes', value: getRecentChanges() || '0' },
    { label: 'Years in Use', value: getYearsInUse() || '1' }
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  const handleSwitchToNewStructure = () => {
    setNewStructureName('');
    setShowConfirmDialog(true);
  };

  const confirmNewStructure = () => {
    if (hasCurrentStructure() && currentStructure) {
      const archiveEntry = `${currentStructure.name} (${new Date(currentStructure.createdAt).toLocaleDateString()})`;
      setPastJourneys(prev => [archiveEntry, ...prev]);
      // TODO:
    }

    initializeWithData([], []);


    const structureName = newStructureName.trim() || 'Default Structure';
    createStructure(structureName);

    setShowConfirmDialog(false);
    setActiveItem(null);
    setNewStructureName('');
  };

  const cancelNewStructure = () => {
    setShowConfirmDialog(false);
    setNewStructureName('');
  };

  const handleStartStructure = () => {
    setNewStructureName('');
    setShowConfirmDialog(true);
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

            <div className={styles.inputGroup}>
              <label htmlFor="structureName" className={styles.inputLabel}>
                Structure Name
              </label>
              <input
                id="structureName"
                type="text"
                className={styles.nameInput}
                placeholder="Enter structure name (e.g., Career Development 2026)"
                value={newStructureName}
                onChange={(e) => setNewStructureName(e.target.value)}
                autoFocus
              />
            </div>

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
        {/* Current Structure */}
        <li
          className={`${styles.structureItem} ${activeItem === 'current-structure' ? styles.active : ''}`}
          onClick={() => handleItemClick('current-structure')}
        >
          <span>Current Structure</span>
          <div className={styles.iconContainer}>
            <FaCircle />
            <FaChevronDown className={`${styles.chevron} ${activeItem === 'current-structure' ? styles.rotated : ''}`} />
          </div>
        </li>
        {activeItem === 'current-structure' && (
          <div className={styles.structureContent}>
            <div className={styles.currentStructureContent}>
              {hasCurrentStructure() && currentStructure ? (
                <>
                  <div className={styles.structureInfo}>
                    <p><strong>Structure Name:</strong> {currentStructure.name}</p>
                    <p><strong>Created:</strong> {new Date(currentStructure.createdAt).toLocaleDateString()}</p>
                    <p><strong>Node Count:</strong> {currentStructure.nodes.length} active nodes</p>
                    <p><strong>Edge Count:</strong> {currentStructure.edges.length} connections</p>
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
          </div>
        )}
        <li
          className={`${styles.structureItem} ${activeItem === 'snapshot-archive' ? styles.active : ''}`}
          onClick={() => handleItemClick('snapshot-archive')}
        >
          <span>Snapshot Archive</span>
          <div className={styles.iconContainer}>
            <FaArchive />
            <FaChevronDown className={`${styles.chevron} ${activeItem === 'snapshot-archive' ? styles.rotated : ''}`} />
          </div>
        </li>
        {activeItem === 'snapshot-archive' && (
          <div className={styles.structureContent}>
            <div>
              <p><strong>Archive Count:</strong> 27 snapshots</p>
              <p><strong>Most Recent Snapshot:</strong> "New Chapter Started" - Sep 12, 2024</p>
              <p><strong>Earliest Snapshot:</strong> "Initial Structure" - Mar 10, 2018</p>
              <p><strong>Auto Archive:</strong> Weekly automatic snapshots</p>
              <p><strong>Key Milestones:</strong> Career transition in 2020, Health plan launch in 2022, Creative project start in 2024</p>
            </div>
          </div>
        )}

        {/* Past Journeys */}
        <li
          className={`${styles.structureItem} ${activeItem === 'past-journeys' ? styles.active : ''}`}
          onClick={() => handleItemClick('past-journeys')}
        >
          <span>Past Journeys</span>
          <div className={styles.iconContainer}>
            <FaHistory />
            <FaChevronDown className={`${styles.chevron} ${activeItem === 'past-journeys' ? styles.rotated : ''}`} />
          </div>
        </li>
        {activeItem === 'past-journeys' && (
          <div className={styles.structureContent}>
            <div>
              <p><strong>Journey Span:</strong> {pastJourneys.length > 0
                ? `${pastJourneys[0].split('(')[0]} to present`
                : 'No journeys yet'}</p>
              <p><strong>Main Stages:</strong></p>
              {pastJourneys.length > 0 ? (
                <ul>
                  {pastJourneys.map((stage, index) => (
                    <li key={index}>{stage}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyText}>No past journeys yet</p>
              )}
              <p><strong>Key Turning Points:</strong> To be added</p>
            </div>
          </div>
        )}

        {/* Sealed Chapters */}
        <li
          className={`${styles.structureItem} ${activeItem === 'sealed-chapters' ? styles.active : ''}`}
          onClick={() => handleItemClick('sealed-chapters')}
        >
          <span>Sealed Chapters</span>
          <div className={styles.iconContainer}>
            <FaLock />
            <FaChevronDown className={`${styles.chevron} ${activeItem === 'sealed-chapters' ? styles.rotated : ''}`} />
          </div>
        </li>
        {activeItem === 'sealed-chapters' && (
          <div className={styles.structureContent}>
            <div>
              <p><strong>Sealed Count:</strong> 5 chapters</p>
              <p><strong>Sealing Reasons:</strong></p>
              <ul>
                <li>Student Life System (Sealed in 2020)</li>
                <li>Entrepreneurship Attempt Structure (Sealed in 2022)</li>
                <li>Health Challenge Plan (Sealed in 2023)</li>
              </ul>
              <p><strong>Sealed Duration:</strong> Longest sealed for 4 years, shortest for 1 year</p>
              <p><strong>Note:</strong> Sealed chapters are read-only, can be viewed but not edited</p>
            </div>
          </div>
        )}
      </ul>

      <div className={styles.questionBox}>
        <div className={styles.questionText}>
          {hasCurrentStructure()
            ? "Have I built the right structure for my current stage?"
            : "Ready to build your first life structure?"}
        </div>
        <div className={styles.questionNote}>
          This is the core question you've reflected on over the past {getYearsInUse()} years
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