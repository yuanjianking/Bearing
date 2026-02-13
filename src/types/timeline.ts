export type TimelineAction = 'snapshot' | 'journey' | 'chapter';

// Timeline entry type
export interface TimelineEntry {
  id: string;
  timestamp: number;
  createdAt: string;
  action: TimelineAction;
  title: string;
  targetStructureId: string;
}

// Timeline marker type
export interface TimelineMarker {
  id: string;
  date: string; // YYYY-MM-DD
  position: string; // CSS position percentage
  type: 'past' | 'current' | 'future';
  entryType?: 'snapshot' | 'journey' | 'chapter';
  entryId?: string;
  data?: TimelineEntry;
}