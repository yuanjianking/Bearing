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

// 消息类型
export interface MessageItem {
  id: number;
  type: 'new-node' | 'connection' | 'modification' | 'system';
  text: string;
  time: string;
}

// 洞察项类型
export interface InsightItem {
  id: number;
  title: string;
  content: string;
}

// 快照类型
export interface SnapshotItem {
  id: string;
  label: string;
}

// 时间线标记点类型
export interface TimelineMarker {
  id: string;
  date: string;
  position: string;
  type: 'past' | 'current' | 'future';
}

// React Flow 节点类型
export interface FlowNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: { label: string };
  style: React.CSSProperties;
}

// React Flow 连接类型
export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  style?: React.CSSProperties;
  markerEnd?: {
    type: string;
    color: string;
  };
}