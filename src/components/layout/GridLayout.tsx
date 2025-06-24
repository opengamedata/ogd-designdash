import React, { useState } from 'react';
import { WidthProvider, Layout, Layouts, Responsive, ResponsiveProps } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { BarChart } from '../charts/BarChart';
import { Histogram } from '../charts/Histogram';
import { ScatterPlot } from '../charts/ScatterPlot';
import { Timeline } from '../charts/Timeline';
import { ForceGraph } from '../charts/ForceGraph';

const Grid = WidthProvider(Responsive);

const MAX_ROWS = 4;
const MAX_COLS = 4;

const chartComponents = [BarChart, Histogram, ScatterPlot, Timeline, ForceGraph];

const generateLayout = (rows: number, cols: number): Layout[] => {
  const layout: Layout[] = [];
  let index = 0;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      layout.push({ i: `${index}`, x, y, w: 1, h: 1 });
      index += 1;
    }
  }
  return layout;
};

const GridLayout: React.FC = () => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [layout, setLayout] = useState<Layout[]>(generateLayout(2, 2));

  const updateLayout = (r: number, c: number) => {
    setLayout(generateLayout(r, c));
  };

  const addRow = () => {
    if (rows < MAX_ROWS) {
      const newRows = rows + 1;
      setRows(newRows);
      updateLayout(newRows, cols);
    }
  };

  const removeRow = () => {
    if (rows > 1) {
      const newRows = rows - 1;
      setRows(newRows);
      updateLayout(newRows, cols);
    }
  };

  const addCol = () => {
    if (cols < MAX_COLS) {
      const newCols = cols + 1;
      setCols(newCols);
      updateLayout(rows, newCols);
    }
  };

  const removeCol = () => {
    if (cols > 1) {
      const newCols = cols - 1;
      setCols(newCols);
      updateLayout(rows, newCols);
    }
  };

  return (
    <div>
      <div className="mb-2 space-x-2">
        <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={addRow} type="button">
          Add Row
        </button>
        <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={removeRow} type="button">
          Remove Row
        </button>
        <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={addCol} type="button">
          Add Column
        </button>
        <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={removeCol} type="button">
          Remove Column
        </button>
      </div>
      <Grid
        layouts={{ lg: layout }}
        cols={{ lg: cols }}
        rowHeight={200}
        width={cols * 200}
        onLayoutChange={(l) => setLayout(l)}
        isResizable={false}
      >
        {layout.map((item, idx) => {
          const Chart = chartComponents[idx % chartComponents.length];
          return (
            <div key={item.i} className="border bg-gray-50">
              <Chart />
            </div>
          );
        })}
      </Grid>
    </div>
  );
};

export default GridLayout;
