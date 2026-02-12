export type TimelineAction = 'snapshot' | 'structure_switch' | 'archive' | 'seal_chapter';

// Timeline entry type
export interface TimelineEntry {
  id: string;
  timestamp: number;
  createdAt: string;
  action: TimelineAction;
  title: string;
}

// Timeline marker type
export interface TimelineMarker {
  id: string;
  date: string; // YYYY-MM-DD
  position: string; // CSS position percentage
  type: 'past' | 'current' | 'future';
  entryId?: string;
  data?: TimelineEntry;
}