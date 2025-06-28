import useDataStore from '../../store/useDataStore';
import FilePicker from './FilePicker';

const DataSourceList = () => {
  const { datasets } = useDataStore();

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
          ))}
        </div>
      )}
    </div>
  );
};

export default DataSourceList;
