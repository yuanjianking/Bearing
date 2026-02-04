import React, { useState } from 'react';
import {
  FaBullseye,
  FaExchangeAlt,
  FaCalendarAlt,
  FaChevronDown,
  FaArchive,
  FaHistory,
  FaLock,
  FaCircle
} from 'react-icons/fa';
import type{ StructureItem, StatItem } from '../../types';
import styles from './LeftPanel.module.css';

const LeftPanel: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const structureItems: StructureItem[] = [
    {
      id: 'current-structure',
      label: '当前结构',
      content: {
        status: '活跃',
        created: '2024年1月15日',
        updated: '2024年9月12日',
        nodes: '42个活跃节点',
        description: '当前正在使用的个人系统结构，包含人生愿景、目标规划、日常实践等核心要素。'
      }
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
        span: '2018年至今',
        stages: JSON.stringify([
          '探索期 (2018-2019)：建立基础结构',
          '成长期 (2020-2021)：优化目标体系',
          '转型期 (2022-2023)：调整职业方向',
          '成熟期 (2024至今)：系统化实践'
        ]),
        turningPoints: '2021年添加健康系统、2023年整合创意工作流'
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
    { label: '活跃节点', value: '42' },
    { label: '近期变动', value: '5' },
    { label: '使用年数', value: '7' }
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  const renderContent = (item: StructureItem) => {
    if (item.id === 'current-structure') {
      return (
        <div>
          <p><strong>结构状态：</strong>{item.content.status}</p>
          <p><strong>创建时间：</strong>{item.content.created}</p>
          <p><strong>上次更新：</strong>{item.content.updated}</p>
          <p><strong>节点数量：</strong>{item.content.nodes}</p>
          <p><strong>描述：</strong>{item.content.description}</p>
        </div>
      );
    }

    if (item.id === 'snapshot-archive') {
      return (
        <div>
          <p><strong>存档数量：</strong>{item.content.count}</p>
          <p><strong>最近快照：</strong>{item.content.recent}</p>
          <p><strong>最早快照：</strong>{item.content.earliest}</p>
          <p><strong>自动存档：</strong>{item.content.autoSave}</p>
          <p><strong>重要里程碑：</strong>{item.content.milestones}</p>
        </div>
      );
    }

    if (item.id === 'past-journeys') {
      const stages = JSON.parse(item.content.stages as string);
      return (
        <div>
          <p><strong>历程跨度：</strong>{item.content.span}</p>
          <p><strong>主要阶段：</strong></p>
          <ul>
            {stages.map((stage: string, index: number) => (
              <li key={index}>{stage}</li>
            ))}
          </ul>
          <p><strong>关键转折点：</strong>{item.content.turningPoints}</p>
        </div>
      );
    }

    if (item.id === 'sealed-chapters') {
      const reasons = JSON.parse(item.content.reasons as string);
      return (
        <div>
          <p><strong>封存数量：</strong>{item.content.count}</p>
          <p><strong>封存原因：</strong></p>
          <ul>
            {reasons.map((reason: string, index: number) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
          <p><strong>封存时间：</strong>{item.content.time}</p>
          <p><strong>备注：</strong>{item.content.note}</p>
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
        <div className={styles.questionText}>"我是否为当前阶段构建了合适的结构？"</div>
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