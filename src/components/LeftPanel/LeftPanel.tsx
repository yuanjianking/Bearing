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

  // 当前结构状态管理
  const [currentStructure, setCurrentStructure] = useState<{
    exists: boolean;
    name?: string;
    created?: string;
    nodes?: number;
  }>({
    exists: false // 初始为无结构状态
  });

  // 过往历程状态管理
  const [pastJourneys, setPastJourneys] = useState<string[]>([]);

  const structureItems: StructureItem[] = [
    {
      id: 'current-structure',
      label: '当前结构',
      content: currentStructure
    },
    {
      id: 'snapshot-archive',
      label: '快照存档',
      content: {
        count: '27个快照',
        recent: '"新章节开始" - 2024年9月12日',
        earliest: '"初始结构" - 2018年3月10日',
        autoSave: '每周自动创建快照',
        milestones: '2020年职业转型、2022年健康计划启动、2024年创意项目开始'
      }
    },
    {
      id: 'past-journeys',
      label: '过往历程',
      content: {
        span: pastJourneys.length > 0
          ? `${pastJourneys[0].split('：')[0]} 至今`
          : '暂无历程',
        stages: pastJourneys,
        turningPoints: '待添加'
      }
    },
    {
      id: 'sealed-chapters',
      label: '已封存章节',
      content: {
        count: '5个章节',
        reasons: JSON.stringify([
          '学生时代系统 (封存于2020年)',
          '创业尝试结构 (封存于2022年)',
          '健康挑战期规划 (封存于2023年)'
        ]),
        time: '最长已封存4年，最短1年',
        note: '封存章节只读，可查看但不可编辑'
      }
    }
  ];

  const stats: StatItem[] = [
    { label: '活跃节点', value: currentStructure.nodes?.toString() || '0' },
    { label: '近期变动', value: '0' },
    { label: '使用年数', value: currentStructure.exists ? '1' : '0' }
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  // 处理切换到新结构
  const handleSwitchToNewStructure = () => {
    setShowConfirmDialog(true);
  };

  // 确认创建新结构
  const confirmNewStructure = () => {
    // 1. 如果存在当前结构，自动封存为 Past Journey
    if (currentStructure.exists) {
      const archiveEntry = `${currentStructure.name || '未命名结构'} (${currentStructure.created || '未知时间'})`;
      setPastJourneys(prev => [archiveEntry, ...prev]);
      // TODO: 实际封存逻辑 - 将当前结构移动到已封存章节
    }

    // 2. 创建新结构 - 空结构初始状态
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

    setCurrentStructure({
      exists: true,
      name: '新结构',
      created: dateStr,
      nodes: 0
    });

    // 3. 关闭对话框
    setShowConfirmDialog(false);
    setActiveItem(null); // 收起当前结构面板
  };

  // 取消创建
  const cancelNewStructure = () => {
    setShowConfirmDialog(false);
  };

  // 处理开始新结构
  const handleStartStructure = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

    setCurrentStructure({
      exists: true,
      name: '我的结构',
      created: dateStr,
      nodes: 0
    });
    setActiveItem(null);
  };

  // 类型守卫函数
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
                <p><strong>结构名称：</strong>{content.name || '未命名'}</p>
                <p><strong>创建时间：</strong>{content.created || '未知'}</p>
                <p><strong>节点数量：</strong>{content.nodes || 0}个活跃节点</p>
                <p><strong>结构状态：</strong>活跃中</p>
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
          <p><strong>历程跨度：</strong>{content.span}</p>
          <p><strong>主要阶段：</strong></p>
          {content.stages.length > 0 ? (
            <ul>
              {content.stages.map((stage: string, index: number) => (
                <li key={index}>{stage}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>暂无过往历程</p>
          )}
          <p><strong>关键转折点：</strong>{content.turningPoints}</p>
        </div>
      );
    }

    if (isSnapshotArchive(content)) {
      return (
        <div>
          <p><strong>存档数量：</strong>{content.count}</p>
          <p><strong>最近快照：</strong>{content.recent}</p>
          <p><strong>最早快照：</strong>{content.earliest}</p>
          <p><strong>自动存档：</strong>{content.autoSave}</p>
          <p><strong>重要里程碑：</strong>{content.milestones}</p>
        </div>
      );
    }

    if (isSealedChapter(content)) {
      const reasons = JSON.parse(content.reasons);
      return (
        <div>
          <p><strong>封存数量：</strong>{content.count}</p>
          <p><strong>封存原因：</strong></p>
          <ul>
            {reasons.map((reason: string, index: number) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
          <p><strong>封存时间：</strong>{content.time}</p>
          <p><strong>备注：</strong>{content.note}</p>
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
      {/* 确认对话框 */}
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
            ? "我是否为当前阶段构建了合适的结构？"
            : "准备好构建你的第一个生命结构了吗？"}
        </div>
        <div className={styles.questionNote}>
          这是你在过去7年中反复思考的核心问题
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