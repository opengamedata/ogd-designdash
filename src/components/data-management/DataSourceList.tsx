import useDataStore from '../../store/useDataStore';
import FilePicker from './FilePicker';
import { ScissorsLineDashed, X } from 'lucide-react';

const DataSourceList = () => {
  const { datasets, removeDataset } = useDataStore();

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <FilePicker />
      {Object.keys(datasets).length > 0 && (
        <div className="flex flex-col gap-2 overflow-clip">
          {Object.values(datasets).map((dataset) => (
            <div
              key={dataset.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">
                    {dataset.game}
                  </div>
                  <div className="text-xs text-gray-600">
                    {dataset.startDate} to {dataset.endDate}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dataset.featureLevel}
                  </div>
                </div>
                <button
                  onClick={() => removeDataset(dataset.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Split dataset"
                >
                  <ScissorsLineDashed className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeDataset(dataset.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove dataset"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataSourceList;
