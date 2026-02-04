// useFlowStore.ts
import { create } from 'zustand'
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  Connection,
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
  onConnect: (connection: Connection) => void

  addNode: () => void
  updateNode: (id: string, data: Partial<NodeData>) => void

  deleteNode: (id: string) => void
  saveSnapshot: () => void
  loadSnapshot: (snapshotId: number) => void
}


export const useFlowStore = create<FlowStore>((set) => ({
  nodes: [],

  edges: [  ],

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

  // 连线回调
  onConnect: (connection: Connection) =>
    set((state) => ({
      edges: rfAddEdge({ ...connection, id: nanoid() }, state.edges),
    })),

  // 新增节点
  addNode: () =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id: nanoid(),
          type: 'weight',
          position: { x: 100, y: 100 },
          data: { title: '新承重节点',  description: '', type: 'task', weight: 1},
        },
      ],
    })),

  // 更新节点 data
  updateNode: (id: string, data: Partial<NodeData>) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
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

  // 保存当前流程快照
  saveSnapshot: () =>
    set((state) => ({
      snapshots: [
        ...state.snapshots,
        {
          id: Date.now(),
          createdAt: new Date().toISOString(),
          nodes: JSON.parse(JSON.stringify(state.nodes)),
          edges: JSON.parse(JSON.stringify(state.edges)),
        },
      ],
    })),

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

}))
