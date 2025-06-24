import React, { useMemo, useState } from 'react';
import { WidthProvider, Layout, Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import VizContainer from './VizContainer';
import GridItem from './GridItem';

const MAX_COLS = 12;
const DEFAULT_CHART_WIDTH = 4;
const DEFAULT_CHART_HEIGHT = 3;

/**
 * generateLayout is used to generate the initial layout for the grid.
 */
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

/**
 * GridLayout is the main component that renders the grid layout.
 * It is used to display the grid layout and the charts.
 */
const GridLayout: React.FC = () => {
  const Grid = useMemo(() => WidthProvider(Responsive), []);
  const [layout, setLayout] = useState<Layout[]>(generateLayout());
  const [spawnPoint, setSpawnPoint] = useState<{ x: number; y: number }>({
    x: DEFAULT_CHART_WIDTH,
    y: 0,
  }); // The spawn point is the point where the next chart will be spawned.
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

  const removeChart = (chartId: string) => {
    setCharts((prev) => {
      const newCharts = { ...prev };
      delete newCharts[chartId];
      return newCharts;
    });
    setLayout((prev) => {
      const newLayout = prev.filter((item) => item.i !== chartId);
      updateSpawnPoint(newLayout);
      return newLayout;
    });
  };

  /**
   * updateSpawnPoint is used to update the spawn point for the next chart.
   * It is used to ensure that the next chart is spawned in the correct position.
   */
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
    if (x > MAX_COLS - DEFAULT_CHART_WIDTH) {
      x = 0;
      y += 1;
    }

    setSpawnPoint({ x: x, y: y });
  };

  return (
    <div className="h-100vh">
      <div className="mt-2 space-x-2">
        <button
          className="px-2 py-1 bg-gray-500 text-white rounded"
          onClick={addChart}
          type="button"
        >
          Add Chart
        </button>
      </div>
      <Grid
        layouts={{ lg: layout }}
        cols={{ lg: MAX_COLS }}
        draggableHandle=".drag-handle"
        onLayoutChange={(l: Layout[]) => {
          setLayout(l);
          updateSpawnPoint(l);
        }}
      >
        {layout.map((item, idx) => {
          const ChartComponent = charts[item.i];
          return (
            <GridItem
              key={item.i}
              chartId={item.i}
              className="border bg-gray-50 relative"
              onRemove={removeChart}
            >
              <ChartComponent />
            </GridItem>
          );
        })}
      </Grid>
    </div>
  );
};

export default GridLayout;
