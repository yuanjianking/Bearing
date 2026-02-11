// stores/useTimelineStore.ts
import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';
import type { NodeData } from '../types/flow';
import type { TimelineEntry } from '../types/timeline';
import { nanoid } from 'nanoid';

// 辅助函数：计算系统指标（移到 store 外部，避免类型错误）
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

// Timeline store 类型
interface TimelineStore {
  entries: TimelineEntry[];
  currentEntryId: string | null;

  // 四个关键动作
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

  // 时间轴操作
  goToEntry: (entryId: string) => TimelineEntry | null;
  getCurrentEntry: () => TimelineEntry | null;
  deleteEntry: (entryId: string) => void;
  clearAllEntries: () => void;

  // 导出/导入
  exportEntries: () => string;
  importEntries: (jsonString: string) => boolean;
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  entries: [],
  currentEntryId: null,

  // 1. 记录快照
  recordSnapshot: (title, description, nodes, edges) =>
    set((state) => {
      const todayStr = new Date().toISOString().split('T')[0]

      // 过滤掉今天已记录的快照
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
          tags: ['快照', '手动记录'],
        },
        metrics: calculateMetrics(nodes, edges),
      }

      return {
        entries: [...filteredEntries, entry],
        currentEntryId: entry.id,
      }
    }),

  // 2. 记录结构切换
  recordStructureSwitch: (previousStructure, newStructure, nodes, edges) =>
    set((state) => {
      const entry: TimelineEntry = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        action: 'structure_switch',
        title: `结构切换: ${previousStructure} → ${newStructure}`,
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        metadata: {
          previousStructure,
          newStructure,
          tags: ['结构切换', '自动记录'],
        },
        metrics: calculateMetrics(nodes, edges), // 直接调用外部函数
      };

      return {
        entries: [...state.entries, entry],
        currentEntryId: entry.id,
      };
    }),

  // 3. 记录封存结构
  recordArchive: (title, completionRate, archivedReason, nodes, edges) =>
    set((state) => {
      const entry: TimelineEntry = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        action: 'archive',
        title: `封存: ${title}`,
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        metadata: {
          description: archivedReason,
          completionRate,
          archivedReason,
          tags: ['封存', '阶段完成'],
          emotions: ['成就', '反思'],
        },
        metrics: calculateMetrics(nodes, edges), // 直接调用外部函数
      };

      return {
        entries: [...state.entries, entry],
        currentEntryId: entry.id,
      };
    }),

  // 4. 记录封章
  recordSealChapter: (chapterTitle, chapterSummary, nextChapterPlan, nodes, edges) =>
    set((state) => {
      const entry: TimelineEntry = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        action: 'seal_chapter',
        title: `封章: ${chapterTitle}`,
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        metadata: {
          chapterTitle,
          chapterSummary,
          nextChapterPlan,
          tags: ['封章', '周期结束'],
          insights: ['成长', '规划'],
        },
        metrics: calculateMetrics(nodes, edges), // 直接调用外部函数
      };

      return {
        entries: [...state.entries, entry],
        currentEntryId: entry.id,
      };
    }),

  // 跳转到指定时间点
  goToEntry: (entryId: string) => {
    const entry = get().entries.find(e => e.id === entryId);
    if (entry) {
      set({ currentEntryId: entryId });
      return entry;
    }
    return null;
  },

  // 获取当前时间点
  getCurrentEntry: () => {
    const { currentEntryId, entries } = get();
    return entries.find(e => e.id === currentEntryId) || null;
  },

  // 删除时间点
  deleteEntry: (entryId: string) =>
    set((state) => ({
      entries: state.entries.filter(e => e.id !== entryId),
      currentEntryId: state.currentEntryId === entryId ? null : state.currentEntryId,
    })),

  // 清空所有时间点
  clearAllEntries: () =>
    set({ entries: [], currentEntryId: null }),

  // 导出数据为 JSON
  exportEntries: () => {
    const { entries, currentEntryId } = get();
    return JSON.stringify({
      entries,
      currentEntryId,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  },

  // 从 JSON 导入数据
  importEntries: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);

      // 基本验证
      if (!Array.isArray(data.entries)) {
        throw new Error('无效的数据格式');
      }

      set({
        entries: data.entries,
        currentEntryId: data.currentEntryId || null,
      });

      return true;
    } catch (error) {
      console.error('导入时间轴数据失败:', error);
      return false;
    }
  },
}));