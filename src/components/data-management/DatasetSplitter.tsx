import { useMemo, useState } from 'react';
import useDataStore from '../../store/useDataStore';
import Dialog from '../layout/Dialog';
import Input from '../layout/Input';
import Select from '../layout/Select';
import * as d3 from 'd3';

const DatasetSplitter = ({
  datasetIdToSplit,
  setDatasetIdToSplit,
}: {
  datasetIdToSplit: string | null;
  setDatasetIdToSplit: (datasetId: string | null) => void;
}) => {
  const [featureToSplitBy, setFeatureToSplitBy] = useState<string>('');
  const [splitAtValue, setSplitAtValue] = useState<string>('');

  const { datasets, addDataset } = useDataStore();

  const range = useMemo(() => {
    if (!datasetIdToSplit) return [];
    const dataset = datasets[datasetIdToSplit];
    if (!featureToSplitBy) return [];
    // Extract numeric values for the selected feature
    const values: number[] = dataset.data
      .map((d) => (d as Record<string, any>)[featureToSplitBy])
      .filter((value) => typeof value === 'number' && !isNaN(value));

    return d3.extent(values);
  }, [featureToSplitBy, datasetIdToSplit, datasets]);

  if (!datasetIdToSplit) return null;
  const dataset = datasets[datasetIdToSplit];

  const getFeatureOptions = () => {
    return Object.fromEntries(
      Object.entries(dataset.columnTypes)
        .filter(([_, value]) => value === 'number')
        .map(([key]) => [key, key]),
    );
  };

  const splitDataset = () => {
    const splitAtValueNumber = parseFloat(splitAtValue);
    if (splitAtValueNumber === undefined) {
      alert('Value must be a number');
      return;
    }
    if (range[0] === undefined || range[1] === undefined) {
      alert('No range found for feature');
      return;
    }
    if (splitAtValueNumber < range[0] || splitAtValueNumber > range[1]) {
      alert(
        `Split at value must be within the range of the feature: ${range[0]} to ${range[1]}`,
      );
      return;
    }

    addDataset({
      ...dataset,
      id: `${datasetIdToSplit}-${featureToSplitBy} < ${splitAtValueNumber}`,
      data: Object.assign(
        dataset.data.filter(
          (d) =>
            (d as Record<string, any>)[featureToSplitBy] < splitAtValueNumber,
        ),
        { columns: dataset.data.columns },
      ),
      additionalDetails: {
        split: `${featureToSplitBy} < ${splitAtValueNumber}`,
      },
    });

    addDataset({
      ...dataset,
      id: `${datasetIdToSplit}-${featureToSplitBy} >= ${splitAtValueNumber}`,
      data: Object.assign(
        dataset.data.filter(
          (d) =>
            (d as Record<string, any>)[featureToSplitBy] >= splitAtValueNumber,
        ),
        { columns: dataset.data.columns },
      ),
      additionalDetails: {
        split: `${featureToSplitBy} >= ${splitAtValueNumber}`,
      },
    });
    setDatasetIdToSplit(null);
  };

  return (
    <Dialog
      title={`Splitting dataset ${datasetIdToSplit}`}
      open={datasetIdToSplit !== null}
      onClose={() => {
        setDatasetIdToSplit(null);
        setFeatureToSplitBy('');
        setSplitAtValue('');
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Select
            label="Split by feature"
            value={featureToSplitBy}
            onChange={setFeatureToSplitBy}
            options={getFeatureOptions()}
          />
          {featureToSplitBy && (
            <div className="text-sm text-gray-700">
              Values range from <b>{range[0]}</b> to <b>{range[1]}</b>
            </div>
          )}
        </div>
        <Input
          label="Split at value"
          value={splitAtValue}
          onChange={setSplitAtValue}
        />
        <button
          disabled={!featureToSplitBy || !splitAtValue}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-400 text-white rounded-md font-medium cursor-pointer shadow hover:bg-blue-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={splitDataset}
        >
          Split
        </button>
      </div>
    </Dialog>
  );
};

export default DatasetSplitter;
