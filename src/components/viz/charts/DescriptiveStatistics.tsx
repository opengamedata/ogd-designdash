import { useEffect, useMemo, useState } from 'react';
import useDataStore from '../../../store/useDataStore';
import Select from '../../layout/Select';
import * as d3 from 'd3';

interface DescriptiveStatisticsProps {
  gameDataId: string;
}

const statNames = {
  mean: 'Mean',
  median: 'Median',
  mode: 'Mode',
  range: 'Range',
  variance: 'Variance',
  standardDeviation: 'Std. Dev.',
};

const DescriptiveStatistics: React.FC<DescriptiveStatisticsProps> = ({
  gameDataId,
}) => {
  const dataset = useDataStore().getDatasetByID(gameDataId);
  if (!dataset) return <div>Dataset not found</div>;
  const { data } = dataset;
  const [feature, setFeature] = useState<string>('');

  const stats = useMemo(() => {
    if (!feature || !data.length) return {};
    // Extract numeric values for the selected feature
    const values: number[] = data
      .map((d) => (d as Record<string, any>)[feature])
      .filter((value) => typeof value === 'number' && !isNaN(value));

    // Calculate the mean, median, mode, range, variance, standard deviation, skewness, and kurtosis
    const mean = d3.mean(values);
    const median = d3.median(values);
    const mode = d3.mode(values);
    const range = d3.extent(values);
    const variance = d3.variance(values);
    const standardDeviation = d3.deviation(values);
    // const skewness =
    // const kurtosis = d3.kurtosis(values);

    return {
      mean,
      median,
      mode,
      range,
      variance,
      standardDeviation,
    };
  }, [feature, data]);

  const getFeatureOptions = () => {
    return Object.fromEntries(
      Object.entries(dataset.columnTypes)
        .filter(([_, value]) => value === 'number')
        .map(([key]) => [key, key]),
    );
  };

  return (
    <div className="flex flex-col gap-2 p-2 h-full ">
      <Select
        className="w-full max-w-sm"
        label="Feature"
        value={feature}
        onChange={(value) => setFeature(value)}
        options={getFeatureOptions()}
      />
      <div className="flex flex-col gap-2 h-full justify-center">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex flex-row gap-2">
            <span className=" min-w-[80px]">
              {statNames[key as keyof typeof statNames]}:
            </span>
            <span className="">
              {key === 'range'
                ? `${(value as [number, number])[0]} ~ ${(value as [number, number])[1]}`
                : (value as number).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DescriptiveStatistics;
