import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ChartDimensions {
  width: number;
  height: number;
}

interface UseResponsiveChartOptions {
  minWidth?: number;
  minHeight?: number;
}

export const useResponsiveChart = (
  renderChart: (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    dimensions: ChartDimensions,
  ) => void,
  options: UseResponsiveChartOptions = {},
) => {
  const { minWidth = 200, minHeight = 200 } = options;
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: 0,
    height: 0,
  });

  // Resize observer to handle container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width >= minWidth && height >= minHeight) {
          setDimensions({ width, height });
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [minWidth, minHeight]);

  // Render chart when dimensions or renderChart changes
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
      return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set SVG dimensions to fill container
    d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    // Call the render function
    renderChart(d3.select(svgRef.current), dimensions);
  }, [dimensions, renderChart]);

  return {
    svgRef,
    containerRef,
    dimensions,
  };
};
