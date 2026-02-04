import React, { useState, useEffect } from 'react';
import {
  FaBell,
  FaClock,
  FaChevronDown,
  FaRedo,
  FaExchangeAlt,
} from 'react-icons/fa';
import type { MessageItem, InsightItem } from '../../types';
import styles from './RightPanel.module.css';

const RightPanel: React.FC = () => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 1,
      type: 'new-node',
      text: '新建节点: 添加了"副业项目"到收入来源',
      time: '2分钟前'
    },
    {
      id: 2,
      type: 'connection',
      text: '建立连接: "技能建设"支持"创意工作"',
      time: '15分钟前'
    },
    {
      id: 3,
      type: 'modification',
      text: '节点更新: "日常实践"优先级调整为高级',
      time: '1小时前'
    },
    {
      id: 4,
      type: 'system',
      text: '系统提示: 检测到"健康与活力"节点连续3天未更新',
      time: '3小时前'
    }
  ]);

  const [reflectionOpen, setReflectionOpen] = useState<boolean>(false);
  const [futureOpen, setFutureOpen] = useState<boolean>(false);

  const insights: InsightItem[] = [
    {
      id: 1,
      title: '持续节点',
      content: '"技能建设" 已被质疑 12次'
    },
    {
      id: 2,
      title: '焦点转移',
      content: '在愿景层中添加了新的连接'
    }
  ];

  const addMessage = (text: string, type: MessageItem['type'] = 'system') => {
    const newMessage: MessageItem = {
      id: messages.length + 1,
      type,
      text,
      time: '刚刚'
    };
    setMessages([newMessage, ...messages.slice(0, 4)]);
  };

  useEffect(() => {
    // 模拟初始消息
    const timer = setTimeout(() => {
      addMessage('系统初始化完成，欢迎使用个人系统结构工具', 'new-node');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getInsightIcon = (id: number) => {
    switch (id) {
      case 1: return <FaRedo />;
      case 2: return <FaExchangeAlt />;
      default: return <FaBell />;
    }
  };

  return (
    <div className={`${styles.rightPanel} ${styles.panel}`}>
      {/* 上部：消息动态提示区域 */}
      <div className={styles.insightsSection}>
        <div className={styles.insightsHeader}>
          <FaBell className={styles.insightsIcon} />
          动态消息
        </div>
        <div className={styles.messageFeed}>
          {messages.map((message) => (
            <div
              className={`${styles.messageItem} ${styles[message.type]}`}
              key={message.id}
            >
              <strong>{message.text.split(':')[0]}:</strong>{message.text.split(':')[1]}
              <div className={styles.messageTime}>
                <FaClock className={styles.clockIcon} />
                {message.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 洞察分析区域 */}
      <div className={styles.insightsAnalysis}>
        <div className={styles.insightsHeader}>
          <FaBell className={styles.insightsIcon} />
          洞察分析
        </div>
        {insights.map((insight) => (
          <div className={styles.insightItem} key={insight.id}>
            <div className={styles.insightTitle}>
              {getInsightIcon(insight.id)}
              {insight.title}
            </div>
            <div className={styles.insightContent}>
              {insight.content}
            </div>
          </div>
        ))}
      </div>

      {/* 下部：反思记录和未来路径下拉按钮区域 */}
      <div className={styles.actionsSection}>
        <div className={styles.actionButtons}>
          <div
            className={`${styles.actionDropdown} ${reflectionOpen ? styles.active : ''}`}
            onClick={() => setReflectionOpen(!reflectionOpen)}
          >
            <span>反思记录</span>
            <FaChevronDown className={`${styles.dropdownIcon} ${reflectionOpen ? styles.rotated : ''}`} />
          </div>
          {reflectionOpen && (
            <div className={styles.actionContent}>
              <p><strong>当前反思：</strong>结构已稳定运行3个月，效果良好。但发现"技能建设"与"创意工作"的连接不够紧密，需要加强。</p>
              <p><strong>上次调整：</strong>两周前优化了时间管理节点，增加了具体的时间分配方案。</p>
              <p><strong>改进方向：</strong>考虑为每个节点设置明确的衡量指标，便于跟踪进度。</p>
            </div>
          )}

          <div
            className={`${styles.actionDropdown} ${futureOpen ? styles.active : ''}`}
            onClick={() => setFutureOpen(!futureOpen)}
          >
            <span>未来路径</span>
            <FaChevronDown className={`${styles.dropdownIcon} ${futureOpen ? styles.rotated : ''}`} />
          </div>
          {futureOpen && (
            <div className={styles.actionContent}>
              <p><strong>短期计划（1个月）：</strong>将"健康与活力"与"日常实践"更紧密地连接，创建健康习惯追踪。</p>
              <p><strong>中期计划（3个月）：</strong>为"收入来源"节点添加详细的分支，探索新的收入渠道。</p>
              <p><strong>长期计划（6个月）：</strong>考虑将"学习系统"扩展为知识管理体系，整合阅读、课程和实践。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;