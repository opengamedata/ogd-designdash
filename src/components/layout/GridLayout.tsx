import { useMemo, useState, useEffect } from 'react';
import { WidthProvider, Layout, Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import VizContainer from './VizContainer';
import { v4 as uuidv4 } from 'uuid';

const MAX_COLS = 12;
const DEFAULT_CHART_WIDTH = 4;
const DEFAULT_CHART_HEIGHT = 3;

/**
 * generateLayout is used to generate the initial layout for the grid.
 */
const generateLayout = (): Layout[] => {
  const initialChartId = uuidv4();
  const layout: Layout[] = [];
  layout.push({
    i: initialChartId,
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

  const [layout, setLayout] = useState<Layout[]>([]);
  const [spawnPoint, setSpawnPoint] = useState<{ x: number; y: number }>({
    x: DEFAULT_CHART_WIDTH,
    y: 0,
  }); // The spawn point is the point where the next chart will be spawned.
  const [charts, setCharts] = useState<{ [key: string]: boolean }>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize layout on client side only to prevent hydration mismatch
  useEffect(() => {
    if (!isInitialized) {
      const initialLayout = generateLayout();
      setLayout(initialLayout);
      setCharts({ [initialLayout[0].i]: true });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const addChart = () => {
    const newChartId = uuidv4();
    setCharts((prev) => ({
      ...prev,
      [newChartId]: true,
    }));
    setLayout((prev) => {
      const currentLayout = [
        ...prev,
        {
          i: newChartId,
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
    // If no charts exist, set spawn point to origin
    if (layout.length === 0) {
      setSpawnPoint({ x: 0, y: 0 });
      return;
    }

    // Find the bottom row (highest y + h value)
    let bottomRow = 0;
    layout.forEach((item) => {
      const itemBottom = item.y + item.h;
      if (itemBottom > bottomRow) {
        bottomRow = itemBottom;
      }
    });

    // Find the rightmost position on the bottom row
    let rightmostX = 0;
    layout.forEach((item) => {
      const itemBottom = item.y + item.h;
      if (itemBottom === bottomRow) {
        const itemRight = item.x + item.w;
        if (itemRight > rightmostX) {
          rightmostX = itemRight;
        }
      }
    });

    // Calculate next spawn position
    let nextX = rightmostX;
    let nextY = bottomRow;

    // If the next chart would overflow, move to the next row
    if (nextX + DEFAULT_CHART_WIDTH > MAX_COLS) {
      nextX = 0;
      nextY = bottomRow;
    }

    setSpawnPoint({ x: nextX, y: nextY });
  };

  return (
    <div className="min-h-screen p-2">
      <div className="">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            className="px-2 py-1 bg-gray-300 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={addChart}
            type="button"
          >
            Add Chart
          </button>
        </div>

        {/* Grid */}
        {isInitialized ? (
          <Grid
            layouts={{ lg: layout, md: layout, sm: layout, xs: layout }}
            cols={{ lg: MAX_COLS, md: MAX_COLS, sm: MAX_COLS, xs: MAX_COLS }}
            draggableHandle=".drag-handle"
            isResizable={true}
            onLayoutChange={(l: Layout[]) => {
              setLayout(l);
              updateSpawnPoint(l);
            }}
          >
            {layout.map((item, idx) => {
              const chartExists = charts[item.i];
              if (!chartExists) {
                return null;
              }
              return (
                <VizContainer
                  key={item.i}
                  chartId={item.i}
                  className="bg-white border border-gray-200 rounded-md"
                  onRemove={removeChart}
                />
              );
            })}
          </Grid>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GridLayout;
