import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

const useDataStore = create<DataStore>()(
  //   persist(
  (set, get) => ({
    // states
    datasets: {},
    // actions
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
        if (featureLevel && dataset.featureLevel !== featureLevel) return false;
        return true;
      }),
  }),
  // {
  //   name: 'ogd-data-store',
  // },
  // ),
);

export default useDataStore;
