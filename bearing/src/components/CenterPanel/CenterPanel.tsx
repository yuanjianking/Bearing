import React from 'react';
import styles from './CenterPanel.module.css';

const CenterPanel: React.FC = () => {
  return (
    <div className={`${styles.centerPanel} ${styles.panel}`}>
      <div className={styles.centerPanelContent}>
        {/* 标题区域 */}
        <div className={styles.structureHeader}>
          <div className={styles.headerTitle}>系统结构图</div>
        </div>

        {/* 三层结构容器 */}
        <div className={styles.structureLayers}>

          {/* 第一层：核心目的 */}
          <div className={`${styles.layer} ${styles.layer1}`}>
            <div className={styles.layerHeader}>
              <div className={styles.layerTitle}>核心目的</div>
            </div>
            <div className={styles.layerContent}>
              <div className={styles.layerPlaceholder}>
                核心目的层内容区域
              </div>
            </div>
          </div>

          {/* 第二层：主要目标 */}
          <div className={`${styles.layer} ${styles.layer2}`}>
            <div className={styles.layerHeader}>
              <div className={styles.layerTitle}>主要目标</div>
            </div>
            <div className={styles.layerContent}>
              <div className={styles.layerPlaceholder}>
                主要目标层内容区域
              </div>
            </div>
          </div>

          {/* 第三层：基础 */}
          <div className={`${styles.layer} ${styles.layer3}`}>
            <div className={styles.layerHeader}>
              <div className={styles.layerTitle}>基础</div>
            </div>
            <div className={styles.layerContent}>
              <div className={styles.layerPlaceholder}>
                基础层内容区域
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CenterPanel;