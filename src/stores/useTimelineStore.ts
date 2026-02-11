// stores/useTimelineStore.ts
import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';
import type { NodeData } from '../types/flow';
import type { TimelineEntry } from '../types/timeline';
import { nanoid } from 'nanoid';

// Helper function: calculate system metrics (moved outside store to avoid type errors)
const calculateMetrics = (nodes: Node<NodeData>[], edges: Edge[]) => {
  const layerDistribution = { layer1: 0, layer2: 0, layer3: 0 };
  let totalWeight = 0;

  nodes.forEach(node => {
    const layer = node.data.layer;
    if (layer === 'layer1') layerDistribution.layer1++;
    else if (layer === 'layer2') layerDistribution.layer2++;
    else if (layer === 'layer3') layerDistribution.layer3++;

    totalWeight += node.data.weight || 0;
  });

  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    totalWeight,
    layerDistribution,
  };
};

// Timeline store types
interface TimelineStore {
  entries: TimelineEntry[];
  currentEntryId: string | null;

  // Four key actions
  recordSnapshot: (
    title: string,
    description: string,
    nodes: Node<NodeData>[],
    edges: Edge[]
  ) => void;

  recordStructureSwitch: (
    previousStructure: string,
    newStructure: string,
    nodes: Node<NodeData>[],
    edges: Edge[]
  ) => void;

  recordArchive: (
    title: string,
    completionRate: number,
    archivedReason: string,
    nodes: Node<NodeData>[],
    edges: Edge[]
  ) => void;

  recordSealChapter: (
    chapterTitle: string,
    chapterSummary: string,
    nextChapterPlan: string,
    nodes: Node<NodeData>[],
    edges: Edge[]
  ) => void;

  // Timeline operations
  goToEntry: (entryId: string) => TimelineEntry | null;
  getCurrentEntry: () => TimelineEntry | null;
  deleteEntry: (entryId: string) => void;
  clearAllEntries: () => void;

  // Export/Import
  exportEntries: () => string;
  importEntries: (jsonString: string) => boolean;
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  entries: [],
  currentEntryId: null,

  // 1. Record snapshot
  recordSnapshot: (title, description, nodes, edges) =>
    set((state) => {
      const todayStr = new Date().toISOString().split('T')[0]

      // Filter out snapshots already recorded today
      const filteredEntries = state.entries.filter(
        (entry) => entry.createdAt.split('T')[0] !== todayStr || entry.action !== 'snapshot'
      )

      const entry: TimelineEntry = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        action: 'snapshot',
        title: `${title}`,
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        metadata: {
          description,
          tags: ['Snapshot', 'Manual Record'],
        },
        metrics: calculateMetrics(nodes, edges),
      }

      return {
        entries: [...filteredEntries, entry],
        currentEntryId: entry.id,
      }
    }),

  // 2. Record structure switch
  recordStructureSwitch: (previousStructure, newStructure, nodes, edges) =>
    set((state) => {
      const entry: TimelineEntry = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        action: 'structure_switch',
        title: `Structure Switch: ${previousStructure} → ${newStructure}`,
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        metadata: {
          previousStructure,
          newStructure,
          tags: ['Structure Switch', 'Automatic Record'],
        },
        metrics: calculateMetrics(nodes, edges),
      };

      return {
        entries: [...state.entries, entry],
        currentEntryId: entry.id,
      };
    }),

  // 3. Record archive
  recordArchive: (title, completionRate, archivedReason, nodes, edges) =>
    set((state) => {
      const entry: TimelineEntry = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        action: 'archive',
        title: `Archive: ${title}`,
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        metadata: {
          description: archivedReason,
          completionRate,
          archivedReason,
          tags: ['Archive', 'Phase Complete'],
          emotions: ['Achievement', 'Reflection'],
        },
        metrics: calculateMetrics(nodes, edges),
      };

      return {
        entries: [...state.entries, entry],
        currentEntryId: entry.id,
      };
    }),

  // 4. Record seal chapter
  recordSealChapter: (chapterTitle, chapterSummary, nextChapterPlan, nodes, edges) =>
    set((state) => {
      const entry: TimelineEntry = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        action: 'seal_chapter',
        title: `Seal Chapter: ${chapterTitle}`,
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        metadata: {
          chapterTitle,
          chapterSummary,
          nextChapterPlan,
          tags: ['Seal Chapter', 'Cycle End'],
          insights: ['Growth', 'Planning'],
        },
        metrics: calculateMetrics(nodes, edges),
      };

      return {
        entries: [...state.entries, entry],
        currentEntryId: entry.id,
      };
    }),

  // Go to specific timeline entry
  goToEntry: (entryId: string) => {
    const entry = get().entries.find(e => e.id === entryId);
    if (entry) {
      set({ currentEntryId: entryId });
      return entry;
    }
    return null;
  },

  // Get current timeline entry
  getCurrentEntry: () => {
    const { currentEntryId, entries } = get();
    return entries.find(e => e.id === currentEntryId) || null;
  },

  // Delete timeline entry
  deleteEntry: (entryId: string) =>
    set((state) => ({
      entries: state.entries.filter(e => e.id !== entryId),
      currentEntryId: state.currentEntryId === entryId ? null : state.currentEntryId,
    })),

  // Clear all timeline entries
  clearAllEntries: () =>
    set({ entries: [], currentEntryId: null }),

  // Export data as JSON
  exportEntries: () => {
    const { entries, currentEntryId } = get();
    return JSON.stringify({
      entries,
      currentEntryId,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  },

  // Import data from JSON
  importEntries: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);

      // Basic validation
      if (!Array.isArray(data.entries)) {
        throw new Error('Invalid data format');
      }

      set({
        entries: data.entries,
        currentEntryId: data.currentEntryId || null,
      });

      return true;
    } catch (error) {
      console.error('Failed to import timeline data:', error);
      return false;
    }
  },
}));