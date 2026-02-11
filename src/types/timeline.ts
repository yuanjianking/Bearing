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
    // Common fields
    description?: string;
    tags?: string[];

    // Structure switch specific
    previousStructure?: string;
    newStructure?: string;

    // Archive specific
    completionRate?: number;
    archivedReason?: string;
    emotions?: string[];

    // Seal chapter specific
    chapterTitle?: string;
    chapterSummary?: string;
    nextChapterPlan?: string;
    insights?: string[];
  };
}

export interface TimelineMarker {
  id: string;
  date: string; // YYYY-MM-DD
  position: string; // CSS position percentage
  type: 'past' | 'current' | 'future';
  entryId?: string;
  data?: TimelineEntry;
}