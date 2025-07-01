import React, { useState } from 'react';
import { Move, Minus, Settings } from 'lucide-react';
import { BarChart } from '../viz/charts/BarChart';
import { Histogram } from '../viz/charts/Histogram';
import { ScatterPlot } from '../viz/charts/ScatterPlot';
import { Timeline } from '../viz/charts/Timeline';
import { JobGraph } from '../viz/charts/JobGraph';
import VizSetup from '../viz/VizSetup';
import DescriptiveStatistics from '../viz/charts/DescriptiveStatistics';
import BoxPlot from '../viz/charts/BoxPlot';

interface VizContainerProps {
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  chartId: string;
  onRemove: (chartId: string) => void;
  children?: React.ReactNode;
}

/**
 * VizContainer represents a single chart item in the grid layout with built-in visualization content.
 * It provides drag handles, settings, and remove buttons, while also managing the chart content.
 */
const VizContainer = React.forwardRef<HTMLDivElement, VizContainerProps>(
  (
    {
      style = {},
      className = '',
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      chartId,
      onRemove,
      children,
    },
    ref,
  ) => {
    const [containerMode, setContainerMode] = useState<'settings' | 'viz'>(
      'settings',
    );
    const [vizType, setVizType] = useState<VizType>('bar');
    const [gameDataId, setGameDataId] = useState<string>('');

    const renderChartContent = () => {
      if (containerMode === 'settings') {
        return (
          <VizSetup
            gameDataId={gameDataId}
            setGameDataId={setGameDataId}
            vizType={vizType}
            setVizType={setVizType}
            setContainerMode={setContainerMode}
          />
        );
      }

      return (
        <>
          {vizType === 'bar' && <BarChart gameDataId={gameDataId} />}
          {vizType === 'histogram' && <Histogram gameDataId={gameDataId} />}
          {vizType === 'scatter' && <ScatterPlot gameDataId={gameDataId} />}
          {vizType === 'timeline' && <Timeline />}
          {vizType === 'jobGraph' && <JobGraph gameDataId={gameDataId} />}
          {vizType === 'descriptiveStatistics' && (
            <DescriptiveStatistics gameDataId={gameDataId} />
          )}
          {vizType === 'boxPlot' && <BoxPlot gameDataId={gameDataId} />}
        </>
      );
    };

    return (
      <div
        ref={ref}
        style={style}
        className={`${className} group relative`}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag Handle and Control Buttons */}
        <div className="absolute top-2 right-2 h-6 flex items-center justify-end w-full gap-2">
          <button
            className="drag-handle w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center cursor-move z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ pointerEvents: 'auto' }}
          >
            <Move size={14} className="text-gray-600" />
          </button>
          {containerMode === 'viz' && (
            <button
              className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
              onClick={() => setContainerMode('settings')}
              type="button"
              title="Chart settings"
            >
              <Settings size={14} className="text-gray-600" />
            </button>
          )}
          <button
            className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
            onClick={() => onRemove(chartId)}
            type="button"
            title="Remove chart"
          >
            <Minus size={14} className="text-gray-600" />
          </button>
        </div>

        {/* Chart content */}
        <div className="h-full w-full">{renderChartContent()}</div>
        {children}
      </div>
    );
  },
);

VizContainer.displayName = 'VizContainer';

export default VizContainer;
