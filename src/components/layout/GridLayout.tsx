import React, { useState } from 'react';
import {
  WidthProvider,
  Layout,
  Layouts,
  Responsive,
  ResponsiveProps,
} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { BarChart } from '../charts/BarChart';
import { Histogram } from '../charts/Histogram';
import { ScatterPlot } from '../charts/ScatterPlot';
import { Timeline } from '../charts/Timeline';
import { ForceGraph } from '../charts/ForceGraph';
import VizContainer from './VizContainer';

const Grid = WidthProvider(Responsive);

const MAX_COLS = 12;
const DEFAULT_CHART_WIDTH = 4;
const DEFAULT_CHART_HEIGHT = 3;

const chartComponents = [
  BarChart,
  Histogram,
  ScatterPlot,
  Timeline,
  ForceGraph,
];

const generateLayout = (): Layout[] => {
  const layout: Layout[] = [];
  layout.push({
    i: 'chart-1',
    x: 0,
    y: 0,
    w: DEFAULT_CHART_WIDTH,
    h: DEFAULT_CHART_HEIGHT,
  });
  return layout;
};

const GridLayout: React.FC = () => {
  const [spawnPoint, setSpawnPoint] = useState<{ x: number; y: number }>({
    x: 4,
    y: 0,
  });
  const [layout, setLayout] = useState<Layout[]>(generateLayout());
  const [charts, setCharts] = useState<{ [key: string]: typeof VizContainer }>({
    'chart-1': VizContainer,
  });

  const addChart = () => {
    setCharts((prev) => ({
      ...prev,
      [`chart-${layout.length + 1}`]: VizContainer,
    }));
    setLayout((prev) => {
      const currentLayout = [
        ...prev,
        {
          i: `chart-${layout.length + 1}`,
          x: spawnPoint.x,
          y: spawnPoint.y,
          w: DEFAULT_CHART_WIDTH,
          h: DEFAULT_CHART_HEIGHT,
        },
      ];
      updateSpawnPoint(currentLayout);
      return currentLayout;
    });
  };

  const updateSpawnPoint = (layout: Layout[]) => {
    let x = -1;
    let y = -1;
    layout.forEach((item) => {
      if (item.y + item.h >= y) {
        y = item.y + item.h;
        x = -1;

        if (item.x + item.w > x) {
          x = item.x + item.w;
        }
      }
    });
    console.log('x: ' + x, ' y: ' + y);
    if (x > MAX_COLS - DEFAULT_CHART_WIDTH) {
      x = 0;
      y += 1;
    }

    setSpawnPoint({ x: x, y: y });
  };

  return (
    <div className="h-100vh">
      <Grid
        layouts={{ lg: layout }}
        cols={{ lg: MAX_COLS }}
        // isDraggable={false}
        onLayoutChange={(l: Layout[]) => {
          setLayout(l);
          updateSpawnPoint(l);
        }}
      >
        {layout.map((item, idx) => {
          const ChartComponent = charts[item.i];
          return (
            <div key={item.i} className="border bg-gray-50">
              <p>
                {item.i}
                {' spawnPoint.x: ' + spawnPoint.x}
                {' spawnPoint.y: ' + spawnPoint.y}
              </p>
              <ChartComponent />
            </div>
          );
        })}
      </Grid>
      <div className="mt-2 space-x-2">
        <button
          className="px-2 py-1 bg-gray-500 text-white rounded"
          onClick={addChart}
          type="button"
        >
          Add Chart
        </button>
      </div>
    </div>
  );
};

export default GridLayout;
