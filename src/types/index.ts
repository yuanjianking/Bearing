// 结构项类型
export interface StructureItem {
  id: string;
  label: string;
  content: StructureContent;
}

export interface StructureContent {
  [key: string]: string | string[];
}

// 统计项类型
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