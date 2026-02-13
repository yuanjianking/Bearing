import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow';
import { applyNodeChanges, applyEdgeChanges, addEdge as rfAddEdge } from 'reactflow';
import { nanoid } from 'nanoid';
import type { NodeData } from '../types/flow';
import { useStructureStore } from './useStructureStore';

interface FlowStore {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedId: string | null;

  setSelectedId: (id: string | null) => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (edge: Edge) => void;

  addNode: (node: Node<NodeData>) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  updateEdge: (id: string, updates: Partial<Edge>) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;

  saveSnapshot: () => void;
  loadSnapshot: (snapshotId: string) => void;

  initializeWithData: (initialNodes: Node<NodeData>[], initialEdges: Edge[]) => void;

  syncToStructure: () => void;
}

export const useFlowStore = create<FlowStore>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedId: null,

      setSelectedId: (id) => set({ selectedId: id }),

      onNodesChange: (changes: NodeChange[]) =>
        set((state) => {
          const newNodes = applyNodeChanges(changes, state.nodes);
          setTimeout(() => {
            get().syncToStructure();
          }, 100);
          return { nodes: newNodes };
        }),

      onEdgesChange: (changes: EdgeChange[]) =>
        set((state) => {
          const newEdges = applyEdgeChanges(changes, state.edges);
          setTimeout(() => {
            get().syncToStructure();
          }, 100);
          return { edges: newEdges };
        }),

      onConnect: (edge: Edge) =>
        set((state) => {
          if (!edge.source || !edge.target) return state;

          const finalEdge = {
            ...edge,
            id: edge.id || nanoid(),
            animated: edge.animated !== undefined ? edge.animated : true,
          };

          const newEdges = rfAddEdge(finalEdge, state.edges);

          setTimeout(() => {
            get().syncToStructure();
          }, 100);

          return { edges: newEdges };
        }),

      addNode: (node: Node<NodeData>) =>
        set((state) => {
          const newNodes = [...state.nodes, node];
          setTimeout(() => {
            get().syncToStructure();
          }, 100);
          return { nodes: newNodes };
        }),

      updateNode: (id: string, data: Partial<NodeData>) =>
        set((state) => {
          const newNodes = state.nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...data } } : n
          );
          setTimeout(() => {
            get().syncToStructure();
          }, 100);
          return { nodes: newNodes };
        }),

      updateEdge: (id: string, updates: Partial<Edge>) =>
        set((state) => {
          const newEdges = state.edges.map((edge) =>
            edge.id === id ? { ...edge, ...updates } : edge
          );
          setTimeout(() => {
            get().syncToStructure();
          }, 100);
          return { edges: newEdges };
        }),

      deleteNode: (id: string) =>
        set((state) => {
          const newNodes = state.nodes.filter((n) => n.id !== id);
          const newEdges = state.edges.filter((e) => e.source !== id && e.target !== id);
          setTimeout(() => {
            get().syncToStructure();
          }, 100);
          return {
            nodes: newNodes,
            edges: newEdges,
            selectedId: null,
          };
        }),

      deleteEdge: (id: string) =>
        set((state) => {
          const newEdges = state.edges.filter((edge) => edge.id !== id);
          setTimeout(() => {
            get().syncToStructure();
          }, 100);
          return { edges: newEdges };
        }),

      saveSnapshot: () =>
        set((state) => {
          get().syncToStructure();

          const structureStore = useStructureStore.getState();
          const { currentStructureId, getCurrentStructure, saveSnapshot } = structureStore;

          const targetStructure = currentStructureId ? getCurrentStructure() : null;
          if (!targetStructure) {
            console.warn('Cannot save snapshot: no current structure');
            return state;
          }
          saveSnapshot();
          return state;
        }),

      loadSnapshot: (snapshotId: string) =>
        set(() => {
          const structureStore = useStructureStore.getState();
          const snap = structureStore.snapshots.find((s) => s.id === snapshotId);
          if (!snap) return {};

          const structure = snap.structure;

          return {
            nodes: JSON.parse(JSON.stringify(structure.nodes)),
            edges: JSON.parse(JSON.stringify(structure.edges)),
            selectedId: null,
          };
        }),

      initializeWithData: (initialNodes, initialEdges) =>
        set({
          nodes: initialNodes,
          edges: initialEdges,
        }),

      syncToStructure: () => {
        const { nodes, edges } = get();
        const structureStore = useStructureStore.getState();
        const { currentStructureId, updateStructure, isViewingHistory } = structureStore;

        if (isViewingHistory) {
          console.log('Viewing history mode - skip sync to structure');
          return;
        }

        if (currentStructureId) {
          updateStructure(currentStructureId, nodes, edges);
        }
      },
    }),
    {
      name: 'psst-flow-storage',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        selectedId: state.selectedId,
      }),
    }
  )
);