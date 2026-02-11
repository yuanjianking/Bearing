// types/index.ts 或相关类型定义文件

// 当前结构的类型
export interface CurrentStructure {
  exists: boolean;
  name?: string;
  created?: string;
  nodes?: number;
  status?: string;
}

// 过往历程的类型
export interface PastJourney {
  span: string;
  stages: string[];
  turningPoints: string;
}

// 快照存档的类型
export interface SnapshotArchive {
  count: string;
  recent: string;
  earliest: string;
  autoSave: string;
  milestones: string;
}

// 已封存章节的类型
export interface SealedChapter {
  count: string;
  reasons: string;
  time: string;
  note: string;
}

// 联合类型
export type StructureContent =
  | CurrentStructure
  | PastJourney
  | SnapshotArchive
  | SealedChapter;

export interface StructureItem {
  id: string;
  label: string;
  content: StructureContent;
}

export interface StatItem {
  label: string;
  value: string;
}

// 洞察项类型
export interface InsightItem {
  id: number;
  type: 'persistent' | 'focus' | 'update' | 'system' | 'connection' | 'new-node' | 'modification';
  title: string;
  content: string;
  time: string;
}