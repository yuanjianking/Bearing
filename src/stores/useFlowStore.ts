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
import { useStructureStore } from './useStructureStore'

interface FlowStore {
  nodes: Node<NodeData>[]
  edges: Edge[]

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
  loadSnapshot: (snapshotId: string) => void

  initializeWithData: (initialNodes: Node<NodeData>[], initialEdges: Edge[]) => void

   syncToStructure: () => void
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  nodes: [],

  edges: [],

  snapshots: [],

  selectedId: null,

  // Set selected node
  setSelectedId: (id) => set({ selectedId: id }),

  // Node change callback
  onNodesChange: (changes: NodeChange[]) =>
    set((state) => {
      const newNodes = applyNodeChanges(changes, state.nodes)

      setTimeout(() => {
        get().syncToStructure()
      }, 100)

      return { nodes: newNodes }
    }),


  // Edge change callback
  onEdgesChange: (changes: EdgeChange[]) =>
    set((state) => {
      const newEdges = applyEdgeChanges(changes, state.edges)

      setTimeout(() => {
        get().syncToStructure()
      }, 100)

      return { edges: newEdges }
    }),

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

      const newEdges = rfAddEdge(finalEdge, state.edges)

      setTimeout(() => {
        get().syncToStructure()
      }, 100)

      return { edges: newEdges }
    }),

  // Add node
  addNode: (node: Node<NodeData>) =>
     set((state) => {
      const newNodes = [...state.nodes, node]

      setTimeout(() => {
        get().syncToStructure()
      }, 100)

      return { nodes: newNodes }
    }),

  // Update node data
  updateNode: (id: string, data: Partial<NodeData>) =>
   set((state) => {
      const newNodes = state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      )

      setTimeout(() => {
        get().syncToStructure()
      }, 100)

      return { nodes: newNodes }
    }),

  // Update edge properties
  updateEdge: (id: string, updates: Partial<Edge>) =>
    set((state) => {
      const newEdges = state.edges.map((edge) =>
        edge.id === id ? { ...edge, ...updates } : edge
      )

      setTimeout(() => {
        get().syncToStructure()
      }, 100)

      return { edges: newEdges }
    }),

  // Delete node and its related connections
  deleteNode: (id: string) =>
    set((state) => {
      const newNodes = state.nodes.filter((n) => n.id !== id)
      const newEdges = state.edges.filter(
        (e) => e.source !== id && e.target !== id
      )

      setTimeout(() => {
        get().syncToStructure()
      }, 100)

      return {
        nodes: newNodes,
        edges: newEdges,
        selectedId: null,
      }
    }),

  // Delete edge
  deleteEdge: (id: string) =>
    set((state) => {
      const newEdges = state.edges.filter((edge) => edge.id !== id)

      setTimeout(() => {
        get().syncToStructure()
      }, 100)

      return { edges: newEdges }
    }),

  // Save current flow snapshot
  saveSnapshot: () =>
    set((state) => {
      get().syncToStructure()

      const structureStore = useStructureStore.getState()
      const { currentStructureId, getCurrentStructure, saveSnapshot } = structureStore

      const targetStructure = currentStructureId ? getCurrentStructure() : null
      if (!targetStructure) {
        console.warn('无法保存快照：没有当前结构')
        return state
      }
      saveSnapshot()
      return state
    }),

  // Load specified snapshot
  loadSnapshot: (snapshotId: string) =>
    set(() => {
      const structureStore = useStructureStore.getState()
      const snap = structureStore.snapshots.find((s) => s.id === snapshotId)
      if (!snap) return {}

      const structure = snap.structure

      return {
        nodes: JSON.parse(JSON.stringify(structure.nodes)),
        edges: JSON.parse(JSON.stringify(structure.edges)),
        selectedId: null,
      }
    }),

  // Initialize nodes and edges with initial data
  initializeWithData: (initialNodes, initialEdges) =>
    set({
      nodes: initialNodes,
      edges: initialEdges,
    }),

  syncToStructure: () => {
    const { nodes, edges } = get()
    const structureStore = useStructureStore.getState()
    const { currentStructureId, updateStructure} = structureStore

    if (currentStructureId) {
      updateStructure(currentStructureId, nodes, edges)
    }
  },
}))