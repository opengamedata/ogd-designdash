import React, { useState, useCallback } from 'react';
import useDataStore from '../../../store/useDataStore';
import * as d3 from 'd3';
import {
  regressionLinear,
  regressionQuad,
  regressionExp,
  regressionLog,
} from 'd3-regression';
import Select from '../../layout/Select';
import { useResponsiveChart } from '../../../hooks/useResponsiveChart';

interface ScatterPlotProps {
  gameDataId: string;
}

enum RegressionLineType {
  None = 'none',
  Linear = 'linear',
  Quadratic = 'quadratic',
  Exponential = 'exponential',
  Logarithmic = 'logarithmic',
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ gameDataId }) => {
  const { getDatasetByID } = useDataStore();
  const dataset = getDatasetByID(gameDataId);
  const [xFeature, setXFeature] = useState<string>('');
  const [yFeature, setYFeature] = useState<string>('');
  const [regressionLine, setRegressionLine] = useState<RegressionLineType>(
    RegressionLineType.None,
  );

  if (!dataset) {
    return <div>Dataset not found</div>;
  }
  const { data } = dataset;

  const renderChart = useCallback(
    (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
      dimensions: { width: number; height: number },
    ) => {
      if (!xFeature || !yFeature || !data.length) return;

      const margin = { top: 20, right: 20, bottom: 60, left: 60 };
      const width = dimensions.width - margin.left - margin.right;
      const height = dimensions.height - margin.top - margin.bottom;

      const chartGroup = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create scales
      const xScale = d3
        .scaleLinear()
        .domain(
          d3.extent(data, (d) => (d as Record<string, any>)[xFeature]) as [
            number,
            number,
          ],
        )
        .range([0, width])
        .nice();

      const yScale = d3
        .scaleLinear()
        .domain(
          d3.extent(data, (d) => (d as Record<string, any>)[yFeature]) as [
            number,
            number,
          ],
        )
        .range([height, 0])
        .nice();

      // Add dots
      chartGroup
        .selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => xScale((d as Record<string, any>)[xFeature]))
        .attr('cy', (d) => yScale((d as Record<string, any>)[yFeature]))
        .attr('r', 4)
        .attr('fill', '#3b82f6')
        .attr('opacity', 0.7);

      // Add regression line
      if (regressionLine !== RegressionLineType.None) {
        const getRegressionFunction = () => {
          switch (regressionLine) {
            case RegressionLineType.Linear:
              return regressionLinear();
            case RegressionLineType.Quadratic:
              return regressionQuad();
            case RegressionLineType.Exponential:
              return regressionExp();
            case RegressionLineType.Logarithmic:
              return regressionLog();
            default:
              return regressionLinear();
          }
        };

        // Filter data for exponential and logarithmic regression
        let regressionData = data.map((d) => ({
          x: (d as Record<string, any>)[xFeature],
          y: (d as Record<string, any>)[yFeature],
        }));

        // For exponential and logarithmic, filter out non-positive values
        if (
          regressionLine === RegressionLineType.Exponential ||
          regressionLine === RegressionLineType.Logarithmic
        ) {
          regressionData = regressionData.filter((d) => d.x > 0 && d.y > 0);
        }

        // Only proceed if we have enough valid data points
        if (regressionData.length < 2) {
          return;
        }

        const regression = getRegressionFunction()
          .x((d: any) => d.x)
          .y((d: any) => d.y);

        const result = regression(regressionData);

        if (result && result.length > 0) {
          // Generate line points from regression result
          const linePoints = result.map((point: any) => ({
            x: point[0],
            y: point[1],
          }));

          const line = d3
            .line<{ x: number; y: number }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y));

          chartGroup
            .append('path')
            .datum(linePoints)
            .attr('class', 'regression-line')
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', '#ef4444')
            .attr('stroke-width', 2)
            .attr('opacity', 0.8);
        }
      }

      // Add X axis
      const xAxis = d3.axisBottom(xScale);
      chartGroup
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .attr('font-size', Math.max(10, Math.min(12, width / 50)));

      // Add Y axis
      const yAxis = d3.axisLeft(yScale);
      chartGroup
        .append('g')
        .call(yAxis)
        .attr('font-size', Math.max(10, Math.min(12, height / 30)));

      // Add axis labels
      chartGroup
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .attr('font-size', Math.max(12, Math.min(14, height / 25)))
        .attr('fill', '#374151')
        .text(yFeature);

      chartGroup
        .append('text')
        .attr(
          'transform',
          `translate(${width / 2}, ${height + margin.bottom - 10})`,
        )
        .style('text-anchor', 'middle')
        .attr('font-size', Math.max(12, Math.min(14, height / 25)))
        .attr('fill', '#374151')
        .text(xFeature);
    },
    [xFeature, yFeature, regressionLine, data],
  );

  const { svgRef, containerRef } = useResponsiveChart(renderChart);

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <Select
            className="flex-2"
            label="X Feature"
            value={xFeature}
            onChange={(value) => setXFeature(value)}
            options={Object.entries(dataset.columnTypes)
              .filter(([columnName, dataType]) => dataType === 'number')
              .map(([columnName]) => columnName)}
          />
          <Select
            className="flex-2"
            label="Y Feature"
            value={yFeature}
            onChange={(value) => setYFeature(value)}
            options={Object.entries(dataset.columnTypes)
              .filter(([columnName, dataType]) => dataType === 'number')
              .map(([columnName]) => columnName)}
          />
          {/* </div>
        <div className="flex flex-row gap-2"> */}
          <Select
            label="Regression Line"
            value={regressionLine}
            onChange={(value) => setRegressionLine(value as RegressionLineType)}
            options={Object.values(RegressionLineType)}
          />
        </div>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ minHeight: '200px' }}
        ></svg>
      </div>
    </div>
  );
};
