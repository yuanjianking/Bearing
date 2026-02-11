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

// Zustand store types
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

  // Set selected node
  setSelectedId: (id) => set({ selectedId: id }),

  // Node change callback
  onNodesChange: (changes: NodeChange[]) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  // Edge change callback
  onEdgesChange: (changes: EdgeChange[]) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  // Connect callback - modified to accept Connection or Edge
  onConnect: (edge: Edge) =>
    set((state) => {
      // Check if it's a valid Edge
      if (!edge.source || !edge.target) return state;

      // Ensure it has an id
      const finalEdge = {
        ...edge,
        id: edge.id || nanoid(),
        animated: edge.animated !== undefined ? edge.animated : true,
      };

      return {
        edges: rfAddEdge(finalEdge, state.edges),
      };
    }),

  // Add node
  addNode: (node: Node<NodeData>) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        node,
      ],
    })),

  // Update node data
  updateNode: (id: string, data: Partial<NodeData>) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  // Update edge properties
  updateEdge: (id: string, updates: Partial<Edge>) =>
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === id ? { ...edge, ...updates } : edge
      ),
    })),

  // Delete node and its related connections
  deleteNode: (id: string) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter(
        (e) => e.source !== id && e.target !== id
      ),
      selectedId: null,
    })),

  // Delete edge
  deleteEdge: (id: string) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    })),

  // Save current flow snapshot
  saveSnapshot: () =>
    set((state) => {
      // Generate today's date string (YYYY-MM-DD format)
      const todayStr = new Date().toISOString().split('T')[0]

      // Filter out snapshots already created today
      const filteredSnapshots = state.snapshots.filter(
        (snap) => snap.createdAt.split('T')[0] !== todayStr
      )

      return {
        snapshots: [
          ...filteredSnapshots,
          {
            id: Date.now(), // Still use timestamp as unique id
            createdAt: new Date().toISOString(), // Keep full ISO string for sorting
            nodes: JSON.parse(JSON.stringify(state.nodes)),
            edges: JSON.parse(JSON.stringify(state.edges)),
          },
        ],
      }
    }),

  // Load specified snapshot
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

  // Initialize nodes and edges with initial data
  initializeWithData: (initialNodes, initialEdges) =>
    set({
      nodes: initialNodes,
      edges: initialEdges,
    }),
}))