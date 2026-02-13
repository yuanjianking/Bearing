import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

  saveSnapshot: () => void;
  getSnapshotsByStructureId: (structureId: string) => FlowSnapshot[];

  savePastJourney: () => void;
  saveSealedChapter: () => void;

  enterViewMode: (structureId: string) => void;
  exitViewMode: () => void;
}

export const useStructureStore = create<StructureStore>()(
  persist(
    (set, get) => ({
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
          const todayStr = new Date().toISOString().split('T')[0];
          const currentStructure = get().getCurrentStructure();

          if (!currentStructure) {
            return state;
          }

          const filteredSnapshots = state.snapshots.filter(
            (snap) => !(snap.structure.id === currentStructure.id && snap.createdAt.split('T')[0] === todayStr)
          );

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
        return get().snapshots.filter(s => s.structure.id === structureId);
      },

      savePastJourney: () =>
        set((state) => {
          const currentStructure = get().getCurrentStructure();

          if (!currentStructure) {
            return state;
          }

          const newJourney: PastJourney = {
            id: nanoid(),
            timestamp: Date.now(),
            createdAt: new Date().toISOString(),
            structure: currentStructure,
          };

          return {
            pastJourneys: [...state.pastJourneys, newJourney],
          };
        }),

      saveSealedChapter: () =>
        set((state) => {
          const currentStructure = get().getCurrentStructure();

          if (!currentStructure) {
            return state;
          }

          const newChapter: SealedChapter = {
            id: nanoid(),
            timestamp: Date.now(),
            createdAt: new Date().toISOString(),
            structure: currentStructure,
          };

          return {
            SealedChapters: [...state.SealedChapters, newChapter],
            currentStructureId: null,
          };
        }),

      enterViewMode: (structureId: string) => {
        set({
          viewingStructureId: structureId,
          isViewingHistory: true,
        });
      },

      exitViewMode: () => {
        set({
          viewingStructureId: null,
          isViewingHistory: false,
        });
      },
    }),
    {
      name: 'psst-structure-storage',
      partialize: (state) => ({
        structures: state.structures,
        snapshots: state.snapshots,
        pastJourneys: state.pastJourneys,
        SealedChapters: state.SealedChapters,
        currentStructureId: state.currentStructureId,
      }),
    }
  )
);