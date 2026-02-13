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
  FaSync,
  FaCamera,
  FaClock,
  FaTag,
  FaRoute,
  FaBook
} from 'react-icons/fa';

import styles from './LeftPanel.module.css';
import { useStructureStore } from '../../stores/useStructureStore';
import { useFlowStore } from '../../stores/useFlowStore';
import { useTimelineStore } from '../../stores/useTimelineStore';


const LeftPanel: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [newStructureName, setNewStructureName] = useState('');

  // Structure Store
  const structures = useStructureStore((s) => s.structures);
  const currentStructureId = useStructureStore((s) => s.currentStructureId);
  const createStructure = useStructureStore((s) => s.createStructure);
  const hasCurrentStructure = useStructureStore((s) => s.hasCurrentStructure);
  const snapshots = useStructureStore((s) => s.snapshots);
  const pastJourneys = useStructureStore((s) => s.pastJourneys);
  const sealedChapters = useStructureStore((s) => s.SealedChapters);
  const isViewingHistory = useStructureStore((s) => s.isViewingHistory);
  const getSnapshotsByStructureId = useStructureStore((s) => s.getSnapshotsByStructureId);
  const savePastJourney = useStructureStore((s) => s.savePastJourney);
  const enterViewMode = useStructureStore((s) => s.enterViewMode);
  const exitViewMode = useStructureStore((s) => s.exitViewMode);

  // Timeline Store
  const recordJourney = useTimelineStore((s) => s.recordJourney);

  // Flow Store
  const initializeWithData = useFlowStore((s) => s.initializeWithData);
  const setSelectedId = useFlowStore((s) => s.setSelectedId);
  const loadSnapshot = useFlowStore((s) => s.loadSnapshot);

  // Current structure
  const currentStructure = structures.find(s => s.id === currentStructureId);

  // Get snapshots for current structure
  const currentStructureSnapshots = currentStructure
    ? getSnapshotsByStructureId(currentStructure.id)
    : [];

  const snapshotStats = {
    count: currentStructureSnapshots.length,
    latest: currentStructureSnapshots[0],
    earliest: currentStructureSnapshots[currentStructureSnapshots.length - 1]
  };

  // ============== Utility Functions ==============

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

    // 1. Added Nodes
    const addedNodes = currentNodes.filter(
      node => !previousNodes.some(p => p.id === node.id)
    );
    changes += addedNodes.length;

    // 2. Deleted Nodes
    const deletedNodes = previousNodes.filter(
      node => !currentNodes.some(c => c.id === node.id)
    );
    changes += deletedNodes.length;

    // 3. Node Layer Movement
    const movedNodes = currentNodes.filter(node => {
      const prevNode = previousNodes.find(p => p.id === node.id);
      return prevNode && prevNode.data.layer !== node.data.layer;
    });
    changes += movedNodes.length;

    // 4. Added Edges
    const addedEdges = currentEdges.filter(
      edge => !previousEdges.some(p => p.id === edge.id)
    );
    changes += addedEdges.length;

    // 5. Deleted Edges
    const deletedEdges = previousEdges.filter(
      edge => !currentEdges.some(c => c.id === edge.id)
    );
    changes += deletedEdges.length;

    // 6. Edge Direction Changed
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

  // ============== Event Handlers ==============

  const handleItemClick = (itemId: string) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  const handleReturnToCurrentStructure = () => {
    exitViewMode();
    if (currentStructure) {
      initializeWithData(currentStructure.nodes, currentStructure.edges);
      setSelectedId(null);
      setActiveItem(null); // Optional: collapse the panel
    }
  };

  const handleSwitchToNewStructure = () => {
    setNewStructureName('');
    setShowConfirmDialog(true);
  };

  const confirmNewStructure = () => {
    exitViewMode();
    if (hasCurrentStructure() && currentStructure) {
      // Save current structure as Past Journey before switching
      savePastJourney();
      //Record to timeline simultaneously
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const title = `Journey (${dateStr})`;

      // Call timeline store's record journey method
      recordJourney(currentStructure.id, title);
    }

    // Clear canvas
    initializeWithData([], []);

    // Create new structure
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
    exitViewMode();
    setNewStructureName('');
    setShowConfirmDialog(true);
  };

  const handleSnapshotClick = (snapshotId: string) => {
    enterViewMode(currentStructureId!);
    loadSnapshot(snapshotId);
    setActiveItem(null);
  };

  const handlePastJourneyClick = (journeyId: string) => {
    // Find and load the past journey
    const journey = pastJourneys.find(j => j.id === journeyId);
    if (journey) {
      enterViewMode(journey.structure.id);
      initializeWithData(journey.structure.nodes, journey.structure.edges);
      setSelectedId(null);
      setActiveItem(null);
    }
  };

  const handleSealedChapterClick = (chapterId: string) => {
    // Find and load the sealed chapter
    const chapter = sealedChapters.find(c => c.id === chapterId);
    if (chapter) {
      enterViewMode(chapter.structure.id);
      initializeWithData(chapter.structure.nodes, chapter.structure.edges);
      setSelectedId(null);
      setActiveItem(null);
    }
  };

  // ============== Stats ==============

  const stats = [
    { label: 'Active Nodes', value: currentStructure?.nodes.length.toString() || '0' },
    { label: 'Recent Changes', value: getRecentChanges() || '0' },
    { label: 'Years in Use', value: getYearsInUse() || '1' }
  ];

  // ============== Render Functions ==============

  const renderSnapshotArchive = () => (
    <div className={styles.structureContent}>
      {!currentStructure ? (
        <p className={styles.emptyText}>No active structure</p>
      ) : currentStructureSnapshots.length === 0 ? (
        <div className={styles.emptySnapshots}>
          <FaCamera className={styles.emptyIcon} />
          <p>No snapshots yet</p>
          <p className={styles.emptyHint}>Save a snapshot to track your progress</p>
        </div>
      ) : (
        <>
          <div className={styles.snapshotStats}>
            <p><strong>Total Snapshots:</strong> {snapshotStats.count}</p>
            {snapshotStats.latest && (
              <p><strong>Latest:</strong> {new Date(snapshotStats.latest.createdAt).toLocaleDateString()}</p>
            )}
          </div>

          <div className={styles.snapshotList}>
            <h4>Snapshot Timeline</h4>
            {currentStructureSnapshots.map((snapshot, index) => (
              <div
                key={snapshot.id}
                className={styles.snapshotItem}
                onClick={() => handleSnapshotClick(snapshot.id)}
              >
                <div className={styles.snapshotIcon}>
                  <FaCamera />
                </div>
                <div className={styles.snapshotInfo}>
                  <div className={styles.snapshotName}>
                    {snapshot.structure.name || `Snapshot ${currentStructureSnapshots.length - index}`}
                  </div>
                  <div className={styles.snapshotDate}>
                    <FaClock /> {new Date(snapshot.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderPastJourneys = () => (
    <div className={styles.structureContent}>
      {pastJourneys.length === 0 ? (
        <div className={styles.emptySnapshots}>
          <FaHistory className={styles.emptyIcon} />
          <p>No past journeys yet</p>
          <p className={styles.emptyHint}>When you start a new structure, your current one becomes a past journey</p>
        </div>
      ) : (
        <>
          <div className={styles.snapshotStats}>
            <p><strong>Total Journeys:</strong> {pastJourneys.length}</p>
            <p><strong>Journey Span:</strong> {pastJourneys.length > 0
              ? `${new Date(pastJourneys[pastJourneys.length - 1].createdAt).toLocaleDateString()} - ${new Date(pastJourneys[0].createdAt).toLocaleDateString()}`
              : 'N/A'}</p>
          </div>

          <div className={styles.snapshotList}>
            <h4>Past Journeys</h4>
            {pastJourneys.map((journey, index) => (
              <div
                key={journey.id}
                className={styles.snapshotItem}
                onClick={() => handlePastJourneyClick(journey.id)}
              >
                <div className={styles.snapshotIcon}>
                  <FaRoute />
                </div>
                <div className={styles.snapshotInfo}>
                  <div className={styles.snapshotName}>
                    {journey.structure.name || `Journey ${pastJourneys.length - index}`}
                  </div>
                  <div className={styles.snapshotDate}>
                    <FaClock /> {new Date(journey.createdAt).toLocaleDateString()}
                  </div>
                  <div className={styles.snapshotDesc}>
                    <FaTag /> Completed: {new Date(journey.structure.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderSealedChapters = () => (
    <div className={styles.structureContent}>
      {sealedChapters.length === 0 ? (
        <div className={styles.emptySnapshots}>
          <FaLock className={styles.emptyIcon} />
          <p>No sealed chapters yet</p>
          <p className={styles.emptyHint}>Seal a chapter to commemorate a significant life phase</p>
        </div>
      ) : (
        <>
          <div className={styles.snapshotStats}>
            <p><strong>Sealed Chapters:</strong> {sealedChapters.length}</p>
            <p><strong>Time Span:</strong> {sealedChapters.length > 0
              ? `${new Date(sealedChapters[sealedChapters.length - 1].createdAt).toLocaleDateString()} - ${new Date(sealedChapters[0].createdAt).toLocaleDateString()}`
              : 'N/A'}</p>
          </div>

          <div className={styles.snapshotList}>
            <h4>Sealed Chapters</h4>
            {sealedChapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={styles.snapshotItem}
                onClick={() => handleSealedChapterClick(chapter.id)}
              >
                <div className={styles.snapshotIcon}>
                  <FaBook />
                </div>
                <div className={styles.snapshotInfo}>
                  <div className={styles.snapshotName}>
                    {chapter.structure.name || `Chapter ${sealedChapters.length - index}`}
                  </div>
                  <div className={styles.snapshotDate}>
                    <FaClock /> Sealed: {new Date(chapter.createdAt).toLocaleDateString()}
                  </div>
                  <div className={styles.snapshotDesc}>
                    <FaTag /> {new Date(chapter.structure.timestamp).toLocaleDateString()} - {new Date(chapter.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

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

                 <div className={styles.buttonGroup}>
                    {isViewingHistory && (
                      <button
                        className={styles.returnButton}
                        onClick={handleReturnToCurrentStructure}
                      >
                        <FaSync className={styles.buttonIcon} />
                        Return to Current Structure
                      </button>
                    )}

                    <button
                      className={styles.switchButton}
                      onClick={handleSwitchToNewStructure}
                    >
                      <FaSync className={styles.buttonIcon} />
                      Switch to New Structure
                    </button>
                  </div>
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

        {/* Snapshot Archive */}
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
        {activeItem === 'snapshot-archive' && renderSnapshotArchive()}

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
        {activeItem === 'past-journeys' && renderPastJourneys()}

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
        {activeItem === 'sealed-chapters' && renderSealedChapters()}
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