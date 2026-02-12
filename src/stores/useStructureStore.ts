import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { FlowSnapshot, Structure } from '../types/structure';
import type { NodeData } from '../types/flow';
import type { Node, Edge } from 'reactflow';

interface StructureStore {

  structures: Structure[];
  snapshots: FlowSnapshot[]
  currentStructureId: string | null;

  createStructure: (name: string) => Structure;

  hasCurrentStructure: () => boolean;

  updateStructure: (id: string, nodes: Node<NodeData>[], edges: Edge[]) => void;
  getCurrentStructure: () => Structure | null;

  saveSnapshot: () => void
}

export const useStructureStore = create<StructureStore>((set, get) => ({
  structures: [],
  snapshots: [],
  currentStructureId: null,

  createStructure: (name) => {
    const now = Date.now();
    const nowISO = new Date().toISOString();

    const newStructure: Structure = {
      id: nanoid(),
      timestamp: now,
      createdAt: nowISO,
      name: name || `${new Date(now).toLocaleDateString()}`,
      status: 'active',
      nodes: [],
      edges: [],
    };

    set((state) => ({
      structures: [...state.structures, newStructure],
      currentStructureId: newStructure.id,
    }));

    return newStructure;
  },

  hasCurrentStructure: () => {
    const { currentStructureId, structures } = get();
    return currentStructureId !== null && structures.some((s) => s.id === currentStructureId);
  },

  updateStructure: (id, nodes, edges) =>
    set((state) => ({
      structures: state.structures.map((struct) =>
        struct.id === id
          ? {
              ...struct,
              timestamp: Date.now(),
              nodes: JSON.parse(JSON.stringify(nodes)),
              edges: JSON.parse(JSON.stringify(edges)),
              status: 'active',
            }
          : struct
      ),
  })),
  getCurrentStructure: () => {
    const { currentStructureId, structures } = get();
    return structures.find((s) => s.id === currentStructureId) || null;
  },

  saveSnapshot: () =>
    set((state) => {
      // Generate today's date string (YYYY-MM-DD format)
      const todayStr = new Date().toISOString().split('T')[0]

      // Filter out snapshots already created today
      const filteredSnapshots = state.snapshots.filter(
        (snap) => snap.createdAt.split('T')[0] !== todayStr
      )

      const currentStructure = get().getCurrentStructure()

      if (!currentStructure) {
        return state
      }

      const newSnapshot: FlowSnapshot = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        structure: currentStructure,
      };

      return {
        snapshots: [...filteredSnapshots, newSnapshot],
      };
    }),

}));