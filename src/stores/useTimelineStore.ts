// stores/useTimelineStore.ts
import { create } from 'zustand';
import type { TimelineEntry } from '../types/timeline';
import { nanoid } from 'nanoid';
import type { Structure } from '../types/structure';
import { useStructureStore } from './useStructureStore'

// Timeline store types
interface TimelineStore {
  entries: TimelineEntry[];
  currentEntryId: string | null;

  // Four key actions
  recordSnapshot: (
    targetStructureId: string,
    title: string,
  ) => void;

  recordJourney: (
    targetStructureId: string,
    title: string,
  ) => void;

  recordSealChapter: (
    targetStructureId: string,
    chapterTitle: string,
  ) => void;

  // Timeline operations
  goToEntry: (entryId: string) => TimelineEntry | null;
  getCurrentEntry: () => TimelineEntry | null;
  deleteEntry: (entryId: string) => void;
  clearAllEntries: () => void;

  // Export/Import
  exportEntries: () => string;
  importEntries: (jsonString: string) => boolean;
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  entries: [],
  currentEntryId: null,

  // 1. Record snapshot
  recordSnapshot: (targetStructureId: string, title: string) =>
    set((state) => {
      const todayStr = new Date().toISOString().split('T')[0]

      // Filter out snapshots already recorded today
      const filteredEntries = state.entries.filter(
        (entry) => !(
          entry.createdAt.split('T')[0] === todayStr &&
          entry.action === 'snapshot' &&
          entry.targetStructureId === targetStructureId
        )
      );

      const structureStore = useStructureStore.getState()
      const { currentStructureId, getCurrentStructure } = structureStore

      let targetStructure: Structure | null = null
      if (currentStructureId) {
        targetStructure = getCurrentStructure()
      }

      if (!targetStructure) {
        return state
      }


      const entry: TimelineEntry = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        action: 'snapshot',
        title: `${title}`,
        targetStructureId: targetStructureId,
      }

      return {
        entries: [...filteredEntries, entry],
        currentEntryId: entry.id,
      }
    }),


  // 3. Record journey
  recordJourney: (targetStructureId: string, title: string) =>
    set((state) => {
      const entry: TimelineEntry = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        action: 'journey',
        title: `Journey: ${title}`,
        targetStructureId: targetStructureId,
      };

      return {
        entries: [...state.entries, entry],
        currentEntryId: entry.id,
      };
    }),

  // 4. Record seal chapter
  recordSealChapter: (targetStructureId: string, chapterTitle: string) =>
    set((state) => {
      const entry: TimelineEntry = {
        id: nanoid(),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        action: 'chapter',
        title: `Seal Chapter: ${chapterTitle}`,
        targetStructureId: targetStructureId,
      };

      return {
        entries: [...state.entries, entry],
        currentEntryId: entry.id,
      };
    }),

  // Go to specific timeline entry
  goToEntry: (entryId: string) => {
    const entry = get().entries.find(e => e.id === entryId);
    if (entry) {
      set({ currentEntryId: entryId });
      return entry;
    }
    return null;
  },

  // Get current timeline entry
  getCurrentEntry: () => {
    const { currentEntryId, entries } = get();
    return entries.find(e => e.id === currentEntryId) || null;
  },

  // Delete timeline entry
  deleteEntry: (entryId: string) =>
    set((state) => ({
      entries: state.entries.filter(e => e.id !== entryId),
      currentEntryId: state.currentEntryId === entryId ? null : state.currentEntryId,
    })),

  // Clear all timeline entries
  clearAllEntries: () =>
    set({ entries: [], currentEntryId: null }),

  // Export data as JSON
  exportEntries: () => {
    const { entries, currentEntryId } = get();
    return JSON.stringify({
      entries,
      currentEntryId,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  },

  // Import data from JSON
  importEntries: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);

      // Basic validation
      if (!Array.isArray(data.entries)) {
        throw new Error('Invalid data format');
      }

      set({
        entries: data.entries,
        currentEntryId: data.currentEntryId || null,
      });

      return true;
    } catch (error) {
      console.error('Failed to import timeline data:', error);
      return false;
    }
  },
}));