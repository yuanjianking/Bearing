import React, { useState } from 'react';
import {
  FaClock,
  FaChevronDown,
  FaBookOpen,
  FaRoad,
  FaLightbulb,
  FaChartLine,
  FaHistory
} from 'react-icons/fa';
import type { InsightItem } from '../../types';
import styles from './RightPanel.module.css';
import Inspector from '../Inspector/Inspector';

const RightPanel: React.FC = () => {
  const [reflectionOpen, setReflectionOpen] = useState<boolean>(false);
  const [futureOpen, setFutureOpen] = useState<boolean>(false);
  const [isShow] = useState<boolean>(false);

  // Define insight analysis data using InsightItem type
  const insights: InsightItem[] = [ ];

  const getInsightClass = (type: string) => {
    switch (type) {
      case 'persistent': return styles.newNode;
      case 'focus': return styles.connection;
      case 'update': return styles.modification;
      case 'system': return styles.system;
      default: return styles.system;
    }
  };

  return (
    <div className={`${styles.rightPanel} ${styles.panel}`}>
      {/* Insight Analysis Section (using original dynamic message format) */}
      {isShow &&
      <div className={styles.insightsSection}>
        <div className={styles.insightsHeader}>
          <FaLightbulb className={styles.insightsIcon} />
          Insight Analysis
        </div>
        <div className={styles.messageFeed}>
          {insights.map((insight) => (
            <div
              className={`${styles.messageItem} ${getInsightClass(insight.type)}`}
              key={insight.id}
            >
              <strong>{insight.title}:</strong> {insight.content}
              <div className={styles.messageTime}>
                <FaClock className={styles.clockIcon} />
                {insight.time}
              </div>
            </div>
          ))}
        </div>
      </div>
      }
      {/* Reflection Records and Future Path dropdown buttons (moved to middle) */}
      {isShow &&
      <div className={styles.actionsSection}>
        <div className={styles.actionButtons}>
          {/* Reflection Records */}
          <div
            className={`${styles.actionDropdown} ${reflectionOpen ? styles.active : ''}`}
            onClick={() => setReflectionOpen(!reflectionOpen)}
          >
            <div className={styles.dropdownContent}>
              <FaBookOpen className={styles.dropdownIconLeft} />
              <span>Reflection Records</span>
            </div>
            <FaChevronDown className={`${styles.dropdownIconRight} ${reflectionOpen ? styles.rotated : ''}`} />
          </div>
          {reflectionOpen && (
            <div className={styles.actionContent}>
              <div className={styles.actionContentHeader}>
                <FaHistory className={styles.actionContentIcon} />
                <span>Reflection Records Details</span>
              </div>
              <p><strong>Current Reflection:</strong> The structure has been running stably for 3 months with good results. However, the connection between "Skill Building" and "Creative Work" is not tight enough and needs strengthening.</p>
              <p><strong>Last Adjustment:</strong> Optimized time management nodes two weeks ago, adding specific time allocation plans.</p>
              <p><strong>Improvement Direction:</strong> Consider setting clear measurement indicators for each node to facilitate progress tracking.</p>
            </div>
          )}

          {/* Future Path */}
          <div
            className={`${styles.actionDropdown} ${futureOpen ? styles.active : ''}`}
            onClick={() => setFutureOpen(!futureOpen)}
          >
            <div className={styles.dropdownContent}>
              <FaRoad className={styles.dropdownIconLeft} />
              <span>Future Path</span>
            </div>
            <FaChevronDown className={`${styles.dropdownIconRight} ${futureOpen ? styles.rotated : ''}`} />
          </div>
          {futureOpen && (
            <div className={styles.actionContent}>
              <div className={styles.actionContentHeader}>
                <FaChartLine className={styles.actionContentIcon} />
                <span>Future Path Planning</span>
              </div>
              <p><strong>Short-term Plan (1 month):</strong> Connect "Health & Vitality" more closely with "Daily Practice" to create health habit tracking.</p>
              <p><strong>Mid-term Plan (3 months):</strong> Add detailed branches to the "Income Source" node and explore new revenue channels.</p>
              <p><strong>Long-term Plan (6 months):</strong> Consider expanding the "Learning System" into a knowledge management framework, integrating reading, courses, and practice.</p>
            </div>
          )}
        </div>
      </div>
      }
      {/* Node Properties Panel - placed at the bottom */}
      <div className={styles.inspectorSection}>
        <Inspector />
      </div>
    </div>
  );
};

export default RightPanel;