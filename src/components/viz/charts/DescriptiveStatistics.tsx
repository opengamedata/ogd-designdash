import { useEffect, useMemo, useState } from 'react';
import Select from '../../layout/Select';
import SearchableSelect from '../../layout/SearchableSelect';
import * as d3 from 'd3';
import useChartOption from '../../../hooks/useChartOption';

interface DescriptiveStatisticsProps {
  dataset: GameData;
  chartId: string;
}

const measures = {
  mean: 'Mean',
  median: 'Median',
  mode: 'Mode',
  range: 'Range',
  variance: 'Variance',
  standardDeviation: 'Std. Dev.',
};

const DescriptiveStatistics: React.FC<DescriptiveStatisticsProps> = ({
  dataset,
  chartId,
}) => {
  const [feature, setFeature] = useChartOption<string>(chartId, 'feature', '');
  const [measureSelected, setMeasureSelected] = useChartOption<
    keyof typeof measures
  >(chartId, 'measureSelected', 'mean');
  const { data } = dataset;

  const stats = useMemo(() => {
    if (!feature || !data.length) return {};
    // Extract numeric values for the selected feature
    const values: number[] = data
      .map((d) => (d as Record<string, any>)[feature])
      .filter((value) => typeof value === 'number' && !isNaN(value));

    // Calculate the mean, median, mode, range, variance, standard deviation, skewness, and kurtosis
    const mean = d3.mean(values)?.toFixed(2);
    const median = d3.median(values);
    const mode = d3.mode(values);
    const range = d3.extent(values);
    const variance = d3.variance(values)?.toFixed(2);
    const standardDeviation = d3.deviation(values)?.toFixed(2);
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
      <div className="flex flex-row gap-2">
        <SearchableSelect
          className="w-full max-w-sm"
          label="Feature"
          placeholder="Select a feature..."
          value={feature}
          onChange={(value) => setFeature(value)}
          options={getFeatureOptions()}
        />
        <Select
          className="w-full max-w-sm"
          label="Measure"
          value={measureSelected}
          onChange={(value) =>
            setMeasureSelected(value as keyof typeof measures)
          }
          options={measures}
        />
      </div>
      <div className="flex flex-row gap-2 w-full justify-center h-full">
        {feature && measureSelected && (
          <div className="flex flex-col h-full justify-center items-center gap-6">
            <span className="text-6xl font-bold">
              {measureSelected === 'range' && stats[measureSelected]
                ? `${stats[measureSelected][0]} ~ ${stats[measureSelected][1]}`
                : stats[measureSelected]}
            </span>
            <span className="text-lg">
              <strong>
                {measures[measureSelected as keyof typeof measures]}
              </strong>
              {' of '}
              <strong>{feature}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptiveStatistics;
