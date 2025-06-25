import { create } from 'zustand';

interface DataStore {
  datasets: Record<string, GameData>;
  addDataset: (dataset: GameData) => void;
  removeDataset: (id: string) => void;
  lookupDataset: (id: string) => GameData | undefined;
}

const useDataStore = create<DataStore>((set, get) => ({
  datasets: {},
  addDataset: (dataset: GameData) =>
    set((state) => ({
      datasets: { ...state.datasets, [dataset.id]: dataset },
    })),
  removeDataset: (id: string) =>
    set((state) => ({
      datasets: Object.fromEntries(
        Object.entries(state.datasets).filter(([key]) => key !== id),
      ) as Record<string, GameData>,
    })),
  lookupDataset: (id: string) => get().datasets[id],
}));

export default useDataStore;
