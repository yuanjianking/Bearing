// Insight item type
export interface InsightItem {
  id: number;
  type: 'persistent' | 'focus' | 'update' | 'system' | 'connection' | 'new-node' | 'modification';
  title: string;
  content: string;
  time: string;
}