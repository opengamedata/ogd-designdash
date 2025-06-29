import React, { useCallback, useMemo, useState } from 'react';
import useDataStore from '../../../store/useDataStore';
import { useResponsiveChart } from '../../../hooks/useResponsiveChart';
import * as d3 from 'd3';
import Select from '../../layout/Select';

interface JobGraphProps {
  gameDataId: string;
}

type EdgeMode =
  | 'ActiveJobs'
  | 'TopJobCompletionDestinations'
  | 'TopJobSwitchDestinations';

export const JobGraph: React.FC<JobGraphProps> = ({ gameDataId }) => {
  const dataset = useDataStore().getDatasetByID(gameDataId);
  if (!dataset) return <div>Dataset not found</div>;
  const { data } = dataset;

  const [edgeMode, setEdgeMode] = useState<EdgeMode>(
    'TopJobCompletionDestinations',
  );

  const nodes = useMemo(() => {
    const nodes = getNodes(data[0]);
    return nodes;
  }, [data]);

  const edges = useMemo(() => {
    const edges = getEdges(data[0], edgeMode);
    return edges;
  }, [data, edgeMode]);

  const renderChart = useCallback(
    (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
      dimensions: { width: number; height: number },
    ) => {
      // Clear previous content
      svg.selectAll('*').remove();

      // Create color scale for node colors (red to green based on percent complete)
      const colorScale = d3
        .scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateRdYlGn);

      // Create size scale for node radius (based on avg time per attempt)
      const sizeScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(
            Object.values(nodes),
            (d: any) => d['JobsAttempted-avg-time-per-attempt'] || 0,
          ) || 100,
        ])
        .range([5, 30]);

      // Create width scale for edges (based on number of players)
      const widthScale = d3
        .scaleLinear()
        .domain([0, d3.max(edges, (d) => d.value || 0) || 1])
        .range([1, 8]);

      // Create force simulation
      const simulation = d3
        .forceSimulation(Object.values(nodes))
        .force(
          'link',
          d3
            .forceLink(edges)
            .id((d: any) => d.id)
            .distance(100),
        )
        .force('charge', d3.forceManyBody().strength(-300))
        .force(
          'center',
          d3.forceCenter(dimensions.width / 2, dimensions.height / 2),
        )
        .force(
          'collision',
          d3
            .forceCollide()
            .radius(
              (d: any) =>
                sizeScale(d['JobsAttempted-avg-time-per-attempt'] || 0) + 5,
            ),
        );

      // Create edges
      const link = svg
        .append('g')
        .selectAll('line')
        .data(edges)
        .enter()
        .append('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', (d) => widthScale(d.value || 0));

      // Create nodes
      const node = svg
        .append('g')
        .selectAll('circle')
        .data(Object.values(nodes))
        .enter()
        .append('circle')
        .attr('r', (d: any) =>
          sizeScale(d['JobsAttempted-avg-time-per-attempt'] || 0),
        )
        .attr('fill', (d: any) =>
          colorScale(d['JobsAttempted-percent-complete'] || 0),
        )
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);

      // Add drag behavior
      node.call(
        d3
          .drag<SVGCircleElement, any>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended),
      );

      // Add tooltips
      node
        .append('title')
        .text(
          (d: any) =>
            `${d.id}\n` +
            `Avg Time: ${d['JobsAttempted-avg-time-per-attempt']?.toFixed(2) || 'N/A'}\n` +
            `Complete: ${d['JobsAttempted-percent-complete']?.toFixed(1) || 'N/A'}%`,
        );

      link
        .append('title')
        .text(
          (d) => `${d.sourceName} → ${d.targetName}\nPlayers: ${d.value || 0}`,
        );

      // Update positions on simulation tick
      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      });

      // Drag functions
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    },
    [nodes, edges],
  );

  const { svgRef, containerRef } = useResponsiveChart(renderChart);

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <Select
        className="w-full max-w-sm"
        label="Edge Mode"
        value={edgeMode}
        onChange={(value) => setEdgeMode(value as EdgeMode)}
        options={[
          'ActiveJobs',
          'TopJobCompletionDestinations',
          'TopJobSwitchDestinations',
        ]}
      />
      <div ref={containerRef} className="flex-1 min-h-0">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};

const getEdges = (data: any, edgeMode: EdgeMode) => {
  let edges = [];

  const rawLinks: Record<string, Record<string, string[]>> = JSON.parse(
    data[edgeMode],
  );

  switch (edgeMode) {
    case 'TopJobCompletionDestinations':
    case 'TopJobSwitchDestinations':
      for (const [sourceKey, targets] of Object.entries(rawLinks)) {
        for (const [targetKey, players] of Object.entries(targets)) {
          if (sourceKey === targetKey) continue; // omit self-pointing jobs
          edges.push({
            source: sourceKey,
            sourceName: sourceKey,
            target: targetKey,
            targetName: targetKey,
            value: players.length,
            players: players,
          });
        }
      }
      break;
    case 'ActiveJobs':
      const activeJobs = Object.keys(rawLinks);
      for (let i = 1; i < activeJobs.length; i++) {
        const target = activeJobs[i];
        edges.push({
          source: activeJobs[0],
          sourceName: activeJobs[0],
          target: target,
          targetName: target,
          value: 1, // Default value for ActiveJobs edges
        });
      }
      break;
    default:
      alert('Something went wrong. Plase refresh the page and try again');
      break;
  }
  return edges;
};

const getNodes = (data: any) => {
  let nodes: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key.substring(0, 3) !== 'job' && key.substring(0, 7) !== 'mission')
      continue;

    const [jobNumber, jobFeature] = key.split('_');

    if (!nodes.hasOwnProperty(jobNumber)) nodes[jobNumber] = {}; // create node pbject
    if (jobFeature === 'JobsAttempted-job-name')
      nodes[jobNumber].id = value; // store job name as node id
    else if (jobFeature === 'JobsAttempted') continue;
    else nodes[jobNumber][jobFeature] = value;

    // AQUALAB specific: parse job difficulty json
    if (jobFeature === 'JobsAttempted-job-difficulties') {
      nodes[jobNumber][jobFeature] = JSON.parse(nodes[jobNumber][jobFeature]);
    }
  }
  // console.log(nodes)
  return nodes;
};
