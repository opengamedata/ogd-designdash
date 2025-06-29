import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

interface DataStore {
  // states
  datasets: Record<string, GameData>;
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

// Custom storage with error handling and size limits
const customStorage: PersistStorage<DataStore> = {
  getItem: (name: string) => {
    try {
      const item = localStorage.getItem(name);
      console.log(
        '🔍 Attempting to load from localStorage:',
        name,
        item ? 'Found data' : 'No data found',
      );
      if (item) {
        const parsed = JSON.parse(item);
        console.log('📦 Loaded data:', parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  },
  setItem: (name: string, value: any) => {
    try {
      const valueString = JSON.stringify(value);
      console.log(
        '💾 Attempting to save to localStorage:',
        name,
        'Size:',
        new Blob([valueString]).size,
        'bytes',
      );

      // Check if data is too large (localStorage typically has 5-10MB limit)
      const sizeInBytes = new Blob([valueString]).size;
      const sizeInMB = sizeInBytes / (1024 * 1024);

      if (sizeInMB > 4) {
        // 4MB limit to be safe
        console.warn('Data too large for localStorage, skipping persistence');
        return;
      }

      localStorage.setItem(name, valueString);
      console.log('✅ Successfully saved to localStorage');
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn(
          'localStorage quota exceeded, clearing old data and retrying',
        );
        try {
          // Clear all localStorage and retry
          localStorage.clear();
          localStorage.setItem(name, JSON.stringify(value));
        } catch (retryError) {
          console.error(
            'Failed to persist data even after clearing localStorage:',
            retryError,
          );
        }
      } else {
        console.error('Failed to write to localStorage:', error);
      }
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  },
};

const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // states
      datasets: {},
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
      storage: customStorage,
    },
  ),
);

export default useDataStore;
