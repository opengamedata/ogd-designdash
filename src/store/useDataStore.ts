import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { openDB } from 'idb';

interface DataStore {
  // states
  datasets: Record<string, GameData>;
  hasHydrated: boolean;
  // actions
  addDataset: (dataset: GameData) => void;
  removeDataset: (id: string) => void;
  getDatasetByID: (id: string) => GameData | undefined;
  lookupDatasets: (
    game?: string,
    startDate?: string,
    endDate?: string,
    featureLevel?: string,
  ) => GameData[];
}

// IndexedDB storage for larger datasets
const dbPromise = openDB('ogd-data-store', 1, {
  upgrade(db) {
    db.createObjectStore('store');
  },
});

const idbStorage: PersistStorage<DataStore> = {
  getItem: async (name: string) => {
    try {
      const db = await dbPromise;
      const item = await db.get('store', name);
      console.log(
        '🔍 Attempting to load from idb:',
        name,
        item ? 'Found data' : 'No data found',
      );
      return item ?? null;
    } catch (error) {
      console.warn('Failed to read from idb:', error);
      return null;
    }
  },
  setItem: async (name: string, value: any) => {
    try {
      const db = await dbPromise;
      await db.put('store', value, name);
      console.log('✅ Successfully saved to idb');
    } catch (error) {
      console.error('Failed to write to idb:', error);
    }
  },
  removeItem: async (name: string) => {
    try {
      const db = await dbPromise;
      await db.delete('store', name);
    } catch (error) {
      console.warn('Failed to remove from idb:', error);
    }
  },
};

const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // states
      datasets: {},
      hasHydrated: false,
      // actions
      addDataset: (dataset: GameData) => {
        console.log('➕ Adding dataset:', dataset.id);
        set((state) => ({
          datasets: { ...state.datasets, [dataset.id]: dataset },
        }));
      },
      removeDataset: (id: string) => {
        console.log('➖ Removing dataset:', id);
        set((state) => ({
          datasets: Object.fromEntries(
            Object.entries(state.datasets).filter(([key]) => key !== id),
          ) as Record<string, GameData>,
        }));
      },
      getDatasetByID: (id: string) => get().datasets[id],
      lookupDatasets: (
        game?: string,
        startDate?: string,
        endDate?: string,
        featureLevel?: string,
      ) =>
        Object.values(get().datasets).filter((dataset) => {
          if (game && dataset.game !== game) return false;
          if (startDate && dataset.startDate !== startDate) return false;
          if (endDate && dataset.endDate !== endDate) return false;
          if (featureLevel && dataset.featureLevel !== featureLevel)
            return false;
          return true;
        }),
    }),
    {
      name: 'ogd-data-store',
      version: 1,
      storage: idbStorage,
      onRehydrateStorage: () => () => {
        set({ hasHydrated: true });
      },
    },
  ),
);

export default useDataStore;
