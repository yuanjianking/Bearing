import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { FlowSnapshot, PastJourney, SealedChapter, Structure } from '../types/structure';
import type { NodeData } from '../types/flow';
import type { Node, Edge } from 'reactflow';

interface StructureStore {

  structures: Structure[];
  snapshots: FlowSnapshot[];
  pastJourneys: FlowSnapshot[];
  SealedChapters: FlowSnapshot[];
  currentStructureId: string | null;
  viewingStructureId: string | null;
  isViewingHistory: boolean;

  createStructure: (name: string) => Structure;

  hasCurrentStructure: () => boolean;

  updateStructure: (id: string, nodes: Node<NodeData>[], edges: Edge[]) => void;
  getCurrentStructure: () => Structure | null;

  saveSnapshot: () => void
  getSnapshotsByStructureId: (structureId: string) => FlowSnapshot[];

  savePastJourney: () => void;
  saveSealedChapter: () => void;

  enterViewMode: () => void;
  exitViewMode: () => void;

}

export const useStructureStore = create<StructureStore>((set, get) => ({
  structures: [],
  snapshots: [],
  pastJourneys: [],
  SealedChapters: [],
  currentStructureId: null,

  viewingStructureId: null,
  isViewingHistory: false,

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

  getSnapshotsByStructureId: (structureId: string) => {
    return get().snapshots.filter(s => s.structure.id === structureId)
  },

  savePastJourney: () =>
    set((state) => {

      const currentStructure = get().getCurrentStructure()

      if (!currentStructure) {
        return state
      }

      const newyJourney: PastJourney = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        structure: currentStructure,
      };

      return {
        pastJourneys: [...state.pastJourneys, newyJourney],
      };
    }),

  saveSealedChapter: () =>
    set((state) => {

      const currentStructure = get().getCurrentStructure()

      if (!currentStructure) {
        return state
      }

      const newChapter: SealedChapter = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        structure: currentStructure,
      };

      return {
        SealedChapters: [...state.SealedChapters, newChapter],
      };
    }),

  enterViewMode: () => {
     set({
      viewingStructureId: get().currentStructureId,
      isViewingHistory: true
    });
  },

  exitViewMode: () => {
    set({
      viewingStructureId: null,
      isViewingHistory: false
    });
  },
}));