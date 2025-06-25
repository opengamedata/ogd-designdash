import React from 'react';
import useDataStore from '../../../store/useDataStore';
import * as d3 from 'd3';

interface BarChartProps {
  gameDataId: string;
}

export const BarChart: React.FC<BarChartProps> = ({ gameDataId }) => {
  const { getDatasetByID } = useDataStore();
  console.log(gameDataId);
  const dataset = getDatasetByID(gameDataId);
  if (!dataset) {
    return <div>Dataset not found</div>;
  }
  const { data } = dataset;

  return (
    <div>
      <form className="max-w-sm mx-auto">
        <label
          htmlFor="countries"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Feature
        </label>
        <select
          id="countries"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option selected>Select...</option>
          {data.columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </form>

      <svg>
        <g>
          <g></g>
        </g>
      </svg>
    </div>
  );
};
