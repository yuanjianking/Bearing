// useFlowStore.ts
import { create } from 'zustand'
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow'

import { applyNodeChanges, applyEdgeChanges, addEdge as rfAddEdge } from 'reactflow'
import { nanoid } from 'nanoid'
import type { NodeData } from '../types/flow'


// Zustand store 类型
interface FlowSnapshot {
  id: number
  createdAt: string
  nodes: Node<NodeData>[]
  edges: Edge[]
}

interface FlowStore {
  nodes: Node<NodeData>[]
  edges: Edge[]
  snapshots: FlowSnapshot[]
  selectedId: string | null

  setSelectedId: (id: string | null) => void

  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: (edge: Edge) => void

  addNode: (node: Node<NodeData>) => void
  updateNode: (id: string, data: Partial<NodeData>) => void
  updateEdge: (id: string, updates: Partial<Edge>) => void
  deleteNode: (id: string) => void
  deleteEdge: (id: string) => void

  saveSnapshot: () => void
  loadSnapshot: (snapshotId: number) => void

  initializeWithData: (initialNodes: Node<NodeData>[], initialEdges: Edge[]) => void
}


export const useFlowStore = create<FlowStore>((set) => ({
  nodes: [],

  edges: [],

  snapshots: [],

  selectedId: null,

  // 设置选中节点
  setSelectedId: (id) => set({ selectedId: id }),

  // 节点变化回调
  onNodesChange: (changes: NodeChange[]) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  // 边变化回调
  onEdgesChange: (changes: EdgeChange[]) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  // 连线回调 - 修改为接受Connection或Edge
  // useFlowStore.ts
  onConnect: (edge: Edge) =>
    set((state) => {
      // 检查是否为有效的Edge
      if (!edge.source || !edge.target) return state;

      // 确保有id
      const finalEdge = {
        ...edge,
        id: edge.id || nanoid(),
        animated: edge.animated !== undefined ? edge.animated : true,
      };

      return {
        edges: rfAddEdge(finalEdge, state.edges),
      };
    }),

  // 新增节点
  addNode: (node: Node<NodeData>) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        node,
      ],
    })),

  // 更新节点 data
  updateNode: (id: string, data: Partial<NodeData>) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  // 更新边属性
  updateEdge: (id: string, updates: Partial<Edge>) =>
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === id ? { ...edge, ...updates } : edge
      ),
    })),

  // 删除节点及其相关连线
  deleteNode: (id: string) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter(
        (e) => e.source !== id && e.target !== id
      ),
      selectedId: null,
    })),

  // 删除边
  deleteEdge: (id: string) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    })),

  // 保存当前流程快照
  saveSnapshot: () =>
    set((state) => {
    // 生成今天的日期字符串（YYYY-MM-DD格式）
    const todayStr = new Date().toISOString().split('T')[0]

    // 过滤掉今天已存在的快照
    const filteredSnapshots = state.snapshots.filter(
      (snap) => snap.createdAt.split('T')[0] !== todayStr
    )

    return {
      snapshots: [
        ...filteredSnapshots,
        {
          id: Date.now(), // 仍然使用时间戳作为唯一id
          createdAt: new Date().toISOString(), // 保留完整ISO字符串用于排序
          nodes: JSON.parse(JSON.stringify(state.nodes)),
          edges: JSON.parse(JSON.stringify(state.edges)),
        },
      ],
    }}),

  // 加载指定快照
  loadSnapshot: (snapshotId: number) =>
    set((state) => {
      const snap = state.snapshots.find((s) => s.id === snapshotId)
      if (!snap) return {}

      return {
        nodes: snap.nodes,
        edges: snap.edges,
        selectedId: null,
      }
    }),

  // 使用初始数据初始化节点和边
  initializeWithData: (initialNodes, initialEdges) =>
      set({
        nodes: initialNodes,
        edges: initialEdges,
    }),
}))
