import React, { useEffect } from 'react';
import Header from './components/Header/Header';
import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import RightPanel from './components/RightPanel/RightPanel';
import Snapshot from './components/Snapshot/Snapshot';
import Timeline from './components/Timeline/Timeline';
import styles from './App.module.css';
import { useFlowStore } from './stores/useFlowStore';
import { useStructureStore } from './stores/useStructureStore';

const App: React.FC = () => {
  const initializeWithData = useFlowStore((s) => s.initializeWithData);
  const getCurrentStructure = useStructureStore((s) => s.getCurrentStructure);
  const hasCurrentStructure = useStructureStore((s) => s.hasCurrentStructure);
  const createStructure = useStructureStore((s) => s.createStructure);

  useEffect(() => {
    const currentStructure = getCurrentStructure();

    if (hasCurrentStructure() && currentStructure) {
      // Load existing structure
      initializeWithData(currentStructure.nodes, currentStructure.edges);
    } else {


      // Life-oriented three-layer structure example: Building a balanced and healthy life system
      const initialNodes = [
        // Layer 1: Core purpose (only one)
        {
          id: 'core-purpose',
          type: 'weight',
          data: {
            title: 'Balanced Healthy Life',
            layer: 'layer1',
            description: 'Find sustainable balance between work, health, relationships, and growth',
            type: 'goal' as const,
            weight: 10,
          },
          position: { x: 300, y: 30 },
          draggable: true,
        },

        // Layer 2: Main goals (two key pillars)
        {
          id: 'physical-health',
          type: 'weight',
          data: {
            title: 'Physical Health & Vitality',
            layer: 'layer2',
            description: 'Maintain abundant energy and good physical condition',
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
            title: 'Mental Health & Growth',
            layer: 'layer2',
            description: 'Cultivate positive mindset and continuous learning ability',
            type: 'task' as const,
            weight: 8,
          },
          position: { x: 450, y: 180 },
          draggable: true,
        },

        // Layer 3: Base (multiple specific practices)
        {
          id: 'regular-exercise',
          type: 'weight',
          data: {
            title: 'Regular Exercise',
            layer: 'layer3',
            description: 'At least 3 sessions of 30-minute cardio per week',
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
            title: 'Balanced Diet',
            layer: 'layer3',
            description: 'Consume enough fruits and vegetables daily, control sugar intake',
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
            title: 'Adequate Sleep',
            layer: 'layer3',
            description: 'Ensure 7-8 hours of quality sleep every night',
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
            title: 'Daily Meditation',
            layer: 'layer3',
            description: '10 minutes of meditation practice daily',
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
            title: 'Reading Time',
            layer: 'layer3',
            description: '30 minutes of book reading daily',
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
            title: 'Social Connections',
            layer: 'layer3',
            description: 'Stay in touch with family and friends weekly',
            type: 'constraint' as const,
            weight: 3,
          },
          position: { x: 450, y: 400 },
          draggable: true,
        },
      ];

      const initialEdges = [
        // Connections from core purpose to main goals
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

        // Connections from physical health to specific practices
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

        // Connections from mental health to specific practices
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



      // Initialize canvas with example data
      initializeWithData(initialNodes, initialEdges);
    }
  }, [initializeWithData, getCurrentStructure, hasCurrentStructure, createStructure]);

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