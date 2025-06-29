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

      // Create a group for all graph elements
      const g = svg.append('g');

      // Create custom tooltip div
      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px 12px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('font-family', 'monospace')
        .style('pointer-events', 'none')
        .style('z-index', '1000')
        .style('white-space', 'pre-line')
        .style('opacity', 0);

      // Define arrow markers (outside the zoomed group)
      svg
        .append('defs')
        .selectAll('marker')
        .data(['arrow'])
        .enter()
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 9)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#999');

      // Create zoom behavior
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4]) // Limit zoom between 0.1x and 4x
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      // Apply zoom to svg
      svg.call(zoom);

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
      const link = g
        .append('g')
        .selectAll('path')
        .data(edges)
        .enter()
        .append('path')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', (d) => widthScale(d.value || 0))
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrow)')
        .on('mouseover', function (event, d: any) {
          const tooltipContent = `${d.sourceName} → ${d.targetName}\nPlayers: ${d.value || 0}`;

          tooltip
            .style('opacity', 1)
            .html(tooltipContent)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 10 + 'px');
        })
        .on('mouseout', function () {
          tooltip.style('opacity', 0);
        })
        .on('mousemove', function (event) {
          tooltip
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 10 + 'px');
        });

      // Create nodes
      const node = g
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
        .attr('stroke-width', 1.5)
        .on('mouseover', function (event, d: any) {
          let tooltipContent = `${d.id}\n`;
          tooltipContent += `Avg Time: ${d['JobsAttempted-avg-time-per-attempt']?.toFixed(2) || 'N/A'}\n`;

          // Add completion statistics if available
          if (
            d['JobsAttempted-num-completes'] !== undefined &&
            d['JobsAttempted-num-starts'] !== undefined
          ) {
            tooltipContent += `${d['JobsAttempted-num-completes']} of ${d['JobsAttempted-num-starts']} (${d['JobsAttempted-percent-complete']?.toFixed(1)}%) players completed\n`;
          }

          // Add standard deviation if available
          if (d['JobsAttempted-std-dev-per-attempt'] !== undefined) {
            tooltipContent += `Std Dev: ${d['JobsAttempted-std-dev-per-attempt']?.toFixed(2) || 'N/A'}\n`;
          }

          // Add job difficulties if available
          if (
            d['JobsAttempted-job-difficulties'] &&
            typeof d['JobsAttempted-job-difficulties'] === 'object'
          ) {
            const difficulties = d['JobsAttempted-job-difficulties'];
            if (Object.keys(difficulties).length > 0) {
              tooltipContent += `Difficulties: ${Object.entries(difficulties)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')}`;
            }
          }

          tooltip
            .style('opacity', 1)
            .html(tooltipContent)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 10 + 'px');
        })
        .on('mouseout', function () {
          tooltip.style('opacity', 0);
        })
        .on('mousemove', function (event) {
          tooltip
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 10 + 'px');
        });

      // Create node labels
      const label = g
        .append('g')
        .selectAll('text')
        .data(Object.values(nodes))
        .enter()
        .append('text')
        .text((d: any) => d.id)
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('fill', '#333')
        .attr('pointer-events', 'none'); // Prevent labels from interfering with drag

      // Add drag behavior
      node.call(
        d3
          .drag<SVGCircleElement, any>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended),
      );

      // Update positions on simulation tick
      simulation.on('tick', () => {
        link.attr('d', (d: any) => {
          return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
        });

        node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

        label
          .attr(
            'x',
            (d: any) =>
              d.x + sizeScale(d['JobsAttempted-avg-time-per-attempt'] || 0) + 8,
          )
          .attr('y', (d: any) => d.y);
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

      // Return cleanup function to stop simulation when component unmounts or dimensions change
      return () => {
        simulation.stop();
        // Remove custom tooltip
        d3.selectAll('.tooltip').remove();
      };
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

/**
 * Create the edges for the graph
 * @param data - The data to get the edges from
 * @param edgeMode - The edge mode to use
 * @returns The edges
 */
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

/**
 * Create the nodes for the graph
 * @param data - The data to get the nodes from
 * @returns The nodes
 */
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
  return nodes;
};
