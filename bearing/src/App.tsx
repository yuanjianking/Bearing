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
    // 定义初始数据
    const initialNodes = [
      {
        id: 'n1',
        type: 'weight',
        data: {
          title: '核心节点',
          layer: 'layer1',
          description: '',
          type: 'goal' as const,
          weight: 1
        },
        position: { x: 120, y: 30 },
        draggable: true,
      },
      {
        id: 'n2',
        type: 'weight',
        data: {
          title: '目标节点',
          layer: 'layer2',
          description: '',
          type: 'task' as const,
          weight: 1
        },
        position: { x: 240, y: 220 },
        draggable: true,
      },
      {
        id: 'n3',
        type: 'weight',
        data: {
          title: '基础节点',
          layer: 'layer3',
          description: '',
          type: 'constraint' as const,
          weight: 1
        },
        position: { x: 340, y: 420 },
        draggable: true,
      },
    ];

    const initialEdges: never[] = [];

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