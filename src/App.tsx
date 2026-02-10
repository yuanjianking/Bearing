import React, { useEffect } from 'react';
import Header from './components/Header/Header';
import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import RightPanel from './components/RightPanel/RightPanel';
import Snapshot from './components/Snapshot/Snapshot';
import Timeline from './components/Timeline/Timeline';
import styles from './App.module.css';
import { useFlowStore } from './stores/useFlowStore';

const App: React.FC = () => {
  const initializeWithData = useFlowStore((s) => s.initializeWithData);

  useEffect(() => {
    // 生活化的三层结构示例：建立健康平衡的生活系统
    const initialNodes = [
      // 第一层：核心目的（只有一个）
      {
        id: 'core-purpose',
        type: 'weight',
        data: {
          title: '平衡健康的生活',
          layer: 'layer1',
          description: '在工作、健康、关系和成长之间找到可持续的平衡',
          type: 'goal' as const,
          weight: 10,
        },
        position: { x: 300, y: 30 },
        draggable: true,
      },

      // 第二层：主要目标（两个关键支柱）
      {
        id: 'physical-health',
        type: 'weight',
        data: {
          title: '身体健康与活力',
          layer: 'layer2',
          description: '保持充沛精力和良好身体状况',
          type: 'task' as const,
          weight: 9,
        },
        position: { x: 150, y: 180 },
        draggable: true,
      },
      {
        id: 'mental-wellbeing',
        type: 'weight',
        data: {
          title: '心理健康与成长',
          layer: 'layer2',
          description: '培养积极心态和持续学习能力',
          type: 'task' as const,
          weight: 8,
        },
        position: { x: 450, y: 180 },
        draggable: true,
      },

      // 第三层：基础（多个具体实践）
      {
        id: 'regular-exercise',
        type: 'weight',
        data: {
          title: '规律运动',
          layer: 'layer3',
          description: '每周至少3次30分钟有氧运动',
          type: 'constraint' as const,
          weight: 7,
        },
        position: { x: 50, y: 320 },
        draggable: true,
      },
      {
        id: 'healthy-diet',
        type: 'weight',
        data: {
          title: '均衡饮食',
          layer: 'layer3',
          description: '每天摄入足够蔬菜水果，控制糖分',
          type: 'constraint' as const,
          weight: 6,
        },
        position: { x: 240, y: 350 },
        draggable: true,
      },
      {
        id: 'adequate-sleep',
        type: 'weight',
        data: {
          title: '充足睡眠',
          layer: 'layer3',
          description: '保证每晚7-8小时高质量睡眠',
          type: 'constraint' as const,
          weight: 6,
        },
        position: { x: 150, y: 500 },
        draggable: true,
      },
      {
        id: 'daily-meditation',
        type: 'weight',
        data: {
          title: '每日冥想',
          layer: 'layer3',
          description: '每天10分钟冥想练习',
          type: 'constraint' as const,
          weight: 5,
        },
        position: { x: 340, y: 470 },
        draggable: true,
      },
      {
        id: 'reading-time',
        type: 'weight',
        data: {
          title: '阅读时间',
          layer: 'layer3',
          description: '每天30分钟阅读书籍',
          type: 'constraint' as const,
          weight: 4,
        },
        position: { x: 570, y: 520 },
        draggable: true,
      },
      {
        id: 'social-connections',
        type: 'weight',
        data: {
          title: '社交联系',
          layer: 'layer3',
          description: '每周与家人朋友保持联系',
          type: 'constraint' as const,
          weight: 3,
        },
        position: { x: 450, y: 400 },
        draggable: true,
      },

    ];

    const initialEdges = [
      // 核心目的到主要目标的连接
      {
        id: 'e-core-physical',
        source: 'core-purpose',
        target: 'physical-health',
        type: 'visionToGoal',
      },
      {
        id: 'e-core-mental',
        source: 'core-purpose',
        target: 'mental-wellbeing',
        type: 'visionToGoal',
      },

      // 身体健康到具体实践的连接
      {
        id: 'e-physical-exercise',
        source: 'physical-health',
        target: 'regular-exercise',
        type: 'goalToAction',
      },
      {
        id: 'e-physical-diet',
        source: 'physical-health',
        target: 'healthy-diet',
        type: 'goalToAction',
      },
      {
        id: 'e-physical-sleep',
        source: 'physical-health',
        target: 'adequate-sleep',
        type: 'goalToAction',
      },

      // 心理健康到具体实践的连接
      {
        id: 'e-mental-meditation',
        source: 'mental-wellbeing',
        target: 'daily-meditation',
        type: 'goalToAction'
      },
      {
        id: 'e-mental-reading',
        source: 'mental-wellbeing',
        target: 'reading-time',
        type: 'goalToAction',
      },
      {
        id: 'e-mental-social',
        source: 'mental-wellbeing',
        target: 'social-connections',
        type: 'goalToAction',
      },


    ];

    // 初始化数据
    initializeWithData(initialNodes, initialEdges);
  }, [initializeWithData]);

  return (
    <div className={styles.appContainer}>
      <div className={styles.container}>
        <Header />

        <div className={styles.content}>
          <LeftPanel />
          <CenterPanel />
          <RightPanel />
        </div>

        <div className={styles.bottomSections}>
          <Snapshot />
          <Timeline />
        </div>
      </div>
    </div>
  );
};

export default App;