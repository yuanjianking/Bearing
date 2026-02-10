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

  // 定义洞察分析数据，使用InsightItem类型
  const insights: InsightItem[] = [
    {
      id: 1,
      type: 'persistent',
      title: '持续节点',
      content: '"技能建设" 已被质疑 12次',
      time: '今日'
    },
    {
      id: 2,
      type: 'focus',
      title: '焦点转移',
      content: '在愿景层中添加了新的连接',
      time: '今日'
    },
    {
      id: 3,
      type: 'update',
      title: '节点更新',
      content: '"日常实践"优先级调整为高级',
      time: '1小时前'
    },
    {
      id: 4,
      type: 'system',
      title: '系统提示',
      content: '检测到"健康与活力"节点连续3天未更新',
      time: '3小时前'
    }
  ];

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
      {/* 洞察分析区域（使用原动态消息的格式） */}
      <div className={styles.insightsSection}>
        <div className={styles.insightsHeader}>
          <FaLightbulb className={styles.insightsIcon} />
          洞察分析
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

      {/* 反思记录和未来路径下拉按钮区域（移到中部） */}
      <div className={styles.actionsSection}>
        <div className={styles.actionButtons}>
          {/* 反思记录 */}
          <div
            className={`${styles.actionDropdown} ${reflectionOpen ? styles.active : ''}`}
            onClick={() => setReflectionOpen(!reflectionOpen)}
          >
            <div className={styles.dropdownContent}>
              <FaBookOpen className={styles.dropdownIconLeft} />
              <span>反思记录</span>
            </div>
            <FaChevronDown className={`${styles.dropdownIconRight} ${reflectionOpen ? styles.rotated : ''}`} />
          </div>
          {reflectionOpen && (
            <div className={styles.actionContent}>
              <div className={styles.actionContentHeader}>
                <FaHistory className={styles.actionContentIcon} />
                <span>反思记录详情</span>
              </div>
              <p><strong>当前反思：</strong>结构已稳定运行3个月，效果良好。但发现"技能建设"与"创意工作"的连接不够紧密，需要加强。</p>
              <p><strong>上次调整：</strong>两周前优化了时间管理节点，增加了具体的时间分配方案。</p>
              <p><strong>改进方向：</strong>考虑为每个节点设置明确的衡量指标，便于跟踪进度。</p>
            </div>
          )}

          {/* 未来路径 */}
          <div
            className={`${styles.actionDropdown} ${futureOpen ? styles.active : ''}`}
            onClick={() => setFutureOpen(!futureOpen)}
          >
            <div className={styles.dropdownContent}>
              <FaRoad className={styles.dropdownIconLeft} />
              <span>未来路径</span>
            </div>
            <FaChevronDown className={`${styles.dropdownIconRight} ${futureOpen ? styles.rotated : ''}`} />
          </div>
          {futureOpen && (
            <div className={styles.actionContent}>
              <div className={styles.actionContentHeader}>
                <FaChartLine className={styles.actionContentIcon} />
                <span>未来路径规划</span>
              </div>
              <p><strong>短期计划（1个月）：</strong>将"健康与活力"与"日常实践"更紧密地连接，创建健康习惯追踪。</p>
              <p><strong>中期计划（3个月）：</strong>为"收入来源"节点添加详细的分支，探索新的收入渠道。</p>
              <p><strong>长期计划（6个月）：</strong>考虑将"学习系统"扩展为知识管理体系，整合阅读、课程和实践。</p>
            </div>
          )}
        </div>
      </div>
      {/* 节点属性面板 - 放在最下面 */}
      <div className={styles.inspectorSection}>
        <Inspector />
      </div>
    </div>
  );
};

export default RightPanel;