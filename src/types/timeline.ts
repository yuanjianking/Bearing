import type { Node, Edge } from 'reactflow';
import type { NodeData } from './flow';

export type TimelineAction = 'snapshot' | 'structure_switch' | 'archive' | 'seal_chapter';

export interface TimelineEntry {
  id: string;
  timestamp: number;
  createdAt: string;
  action: TimelineAction;
  title: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
  metrics: {
    nodeCount: number;
    edgeCount: number;
    totalWeight: number;
    layerDistribution: {
      layer1: number;
      layer2: number;
      layer3: number;
    };
  };
  metadata?: {
    // 通用字段
    description?: string;
    tags?: string[];

    // 结构切换特定
    previousStructure?: string;
    newStructure?: string;

    // 封存特定
    completionRate?: number;
    archivedReason?: string;
    emotions?: string[];

    // 封章特定
    chapterTitle?: string;
    chapterSummary?: string;
    nextChapterPlan?: string;
    insights?: string[];
  };
}

export interface TimelineMarker {
  id: string;
  date: string; // YYYY-MM
  position: string; // CSS位置百分比
  type: 'past' | 'current' | 'future';
  entryId?: string;
  data?: TimelineEntry;
}