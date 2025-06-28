import React, { useCallback } from 'react';
import useDataStore from '../../../store/useDataStore';
import { useResponsiveChart } from '../../../hooks/useResponsiveChart';
import * as d3 from 'd3';

interface ForceGraphProps {
  gameDataId: string;
}

export const ForceGraph: React.FC<ForceGraphProps> = ({ gameDataId }) => {
  const dataset = useDataStore().getDatasetByID(gameDataId);
  if (!dataset) return <div>Dataset not found</div>;
  const { data } = dataset;

  const validateData = (data: d3.DSVRowArray<any>) => {
    // check if data has the following columns: 'ActiveJobs', 'TopJobSwitchDestinations', 'TopJobCompletionDestinations', 'JobsAttempted-percent-complete', 'JobsAttempted-num-completes', 'JobsAttempted-num-starts', 'JobsAttempted-job-name', 'JobsAttempted-avg-time-per-attempt', 'JobsAttempted-std-dev-per-attempt', 'JobsAttempted-job-difficulties'
    const requiredColumns = [
      'ActiveJobs',
      'TopJobSwitchDestinations',
      'TopJobCompletionDestinations',
      'JobsAttempted-percent-complete',
      'JobsAttempted-num-completes',
      'JobsAttempted-num-starts',
      'JobsAttempted-job-name',
      'JobsAttempted-avg-time-per-attempt',
      'JobsAttempted-std-dev-per-attempt',
    ];
    const optionalColumns = ['JobsAttempted-job-difficulties'];
    return requiredColumns.every((column) => data.columns.includes(column));
  };

  if (!validateData(data)) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col overflow-y-auto">
          {data.columns.map((column) => (
            <div key={String(column)}>{String(column)}</div>
          ))}
        </div>
      </div>
    );
  }

  const renderChart = useCallback(
    (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
      dimensions: { width: number; height: number },
    ) => {
      if (!data.length) return;
      //
    },
    [data],
  );

  const { svgRef, containerRef } = useResponsiveChart(renderChart);

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div ref={containerRef} className="flex-1 min-h-0">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};
