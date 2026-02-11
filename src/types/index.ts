// Current structure type
export interface CurrentStructure {
  exists: boolean;
  name?: string;
  created?: string;
  nodes?: number;
  status?: string;
}

// Past journey type
export interface PastJourney {
  span: string;
  stages: string[];
  turningPoints: string;
}

// Snapshot archive type
export interface SnapshotArchive {
  count: string;
  recent: string;
  earliest: string;
  autoSave: string;
  milestones: string;
}

// Sealed chapter type
export interface SealedChapter {
  count: string;
  reasons: string;
  time: string;
  note: string;
}

// Union type
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

// Insight item type
export interface InsightItem {
  id: number;
  type: 'persistent' | 'focus' | 'update' | 'system' | 'connection' | 'new-node' | 'modification';
  title: string;
  content: string;
  time: string;
}