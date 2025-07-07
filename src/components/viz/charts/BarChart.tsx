import React, { useState, useCallback, useMemo, useEffect } from 'react';
import useDataStore from '../../../store/useDataStore';
import * as d3 from 'd3';
import Select from '../../layout/Select';
import { useResponsiveChart } from '../../../hooks/useResponsiveChart';
import SearchableSelect from '../../layout/SearchableSelect';

interface BarChartProps {
  gameDataId: string;
}

export const BarChart: React.FC<BarChartProps> = ({ gameDataId }) => {
  const dataset = useDataStore().getDatasetByID(gameDataId);
  if (!dataset) return <div>Dataset not found</div>;
  const { data } = dataset;
  const [feature, setFeature] = useState<string>('');
  const [filter, setFilter] = useState<string[]>([]);

  useEffect(() => {
    setFilter([]);
  }, [feature]);

  const renderChart = useCallback(
    (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
      dimensions: { width: number; height: number },
    ) => {
      if (!feature || !data.length) return;

      // Get unique values and their counts for the selected feature
      const valueCounts = d3.rollup(
        data,
        (v) => v.length,
        (d) => (d as Record<string, any>)[feature],
      );

      const chartData = Array.from(valueCounts.entries())
        .map(([value, count]) => ({
          value: String(value),
          count,
        }))
        .filter((d) => filter.length === 0 || filter.includes(d.value));

      // Sort by count descending
      // chartData.sort((a, b) => b.count - a.count);

      // Chart dimensions with responsive margins
      const margin = {
        top: 20,
        right: 20,
        bottom: 60,
        left: 60,
      };
      const width = dimensions.width - margin.left - margin.right;
      const height = dimensions.height - margin.top - margin.bottom;

      const chartGroup = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // X scale (categorical)
      const xScale = d3
        .scaleBand()
        .domain(chartData.map((d) => d.value))
        .range([0, width])
        .padding(0.1);

      // Y scale (linear)
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(chartData, (d) => d.count) || 0])
        .range([height, 0]);

      // Add bars
      chartGroup
        .selectAll('.bar')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => xScale(d.value) || 0)
        .attr('y', (d) => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => height - yScale(d.count))
        .attr('fill', '#3b82f6')
        .attr('rx', 2);

      // Add bar labels (only if there's enough space)
      if (chartData.length <= 20) {
        // Limit labels to prevent overcrowding
        chartGroup
          .selectAll('.bar-label')
          .data(chartData)
          .enter()
          .append('text')
          .attr('class', 'bar-label')
          .attr('x', (d) => (xScale(d.value) || 0) + xScale.bandwidth() / 2)
          .attr('y', (d) => yScale(d.count) - 5)
          .attr('text-anchor', 'middle')
          .attr('font-size', Math.max(10, Math.min(12, height / 30)))
          .attr('fill', '#374151')
          .text((d) => d.count);
      }

      // Add X axis
      const xAxis = d3.axisBottom(xScale);
      chartGroup
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll('text')
        .attr('transform', 'rotate(-30)')
        .style('text-anchor', 'end')
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
        .text('Count');

      chartGroup
        .append('text')
        .attr(
          'transform',
          `translate(${width / 2}, ${height + margin.bottom - 10})`,
        )
        .style('text-anchor', 'middle')
        .attr('font-size', Math.max(12, Math.min(14, height / 25)))
        .attr('fill', '#374151')
        .text(feature);
    },
    [feature, data, filter],
  );

  const { svgRef, containerRef } = useResponsiveChart(renderChart);

  const getFeatureOptions = () => {
    return Object.fromEntries(
      Object.entries(dataset.columnTypes)
        .filter(([_, value]) => value === 'string')
        .map(([key]) => [key, key]),
    );
  };

  const filterOptions = useMemo(() => {
    if (!feature) return {};
    const categories = Array.from(
      new Set(data.map((d) => (d as Record<string, any>)[feature].toString())),
    );
    return Object.fromEntries(
      categories.map((category) => [category, category]),
    );
  }, [feature, data]);

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <Select
        className="w-full max-w-sm"
        label="Feature"
        value={feature}
        onChange={(value) => setFeature(value)}
        options={getFeatureOptions()}
      />
      {feature && (
        <SearchableSelect
          className="w-fit"
          label="Categories to include"
          placeholder="All"
          value={filter}
          onChange={(value) => setFilter(value)}
          options={filterOptions}
          selectMultiple
        />
      )}

      <div ref={containerRef} className="flex-1 min-h-0">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};
