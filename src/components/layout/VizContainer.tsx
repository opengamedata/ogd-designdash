import React, { useState, useEffect } from 'react';
import { Move, Minus, Settings, Database } from 'lucide-react';
import { BarChart } from '../viz/charts/BarChart';
import { Histogram } from '../viz/charts/Histogram';
import { ScatterPlot } from '../viz/charts/ScatterPlot';
import { Timeline } from '../viz/charts/Timeline';
import { JobGraph } from '../viz/charts/JobGraph';
import { Sankey } from '../viz/charts/Sankey';
import VizSetup from '../viz/VizSetup';
import DescriptiveStatistics from '../viz/charts/DescriptiveStatistics';
import BoxPlot from '../viz/charts/BoxPlot';
import { VizType, VizTypeKey } from '../../constants/vizTypes';
import useLayoutStore from '../../store/useLayoutStore';

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
    const chartConfig = useLayoutStore((state) => {
      const cur = state.currentLayout;
      return cur ? state.layouts[cur]?.charts[chartId] : undefined;
    });
    const updateChartConfig = useLayoutStore(
      (state) => state.updateChartConfig,
    );

    const [containerMode, setContainerMode] = useState<'settings' | 'viz'>(
      chartConfig?.vizType && chartConfig?.datasetId ? 'viz' : 'settings',
    );
    const [vizType, setVizType] = useState<VizTypeKey>(
      chartConfig?.vizType || 'bar',
    );
    const [gameDataId, setGameDataId] = useState<string>(
      chartConfig?.datasetId || '',
    );

    useEffect(() => {
      if (chartConfig) {
        setVizType(chartConfig.vizType);
        setGameDataId(chartConfig.datasetId);
      }
    }, [chartConfig]);

    useEffect(() => {
      updateChartConfig(chartId, { vizType });
    }, [vizType]);

    useEffect(() => {
      updateChartConfig(chartId, { datasetId: gameDataId });
    }, [gameDataId]);

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
          {vizType === 'bar' && (
            <BarChart key={chartId} chartId={chartId} gameDataId={gameDataId} />
          )}
          {vizType === 'histogram' && (
            <Histogram
              key={chartId}
              chartId={chartId}
              gameDataId={gameDataId}
            />
          )}
          {vizType === 'scatter' && (
            <ScatterPlot
              key={chartId}
              chartId={chartId}
              gameDataId={gameDataId}
            />
          )}
          {vizType === 'timeline' && (
            <Timeline key={chartId} chartId={chartId} gameDataId={gameDataId} />
          )}
          {vizType === 'jobGraph' && (
            <JobGraph key={chartId} chartId={chartId} gameDataId={gameDataId} />
          )}
          {vizType === 'sankey' && (
            <Sankey key={chartId} chartId={chartId} gameDataId={gameDataId} />
          )}
          {vizType === 'descriptiveStatistics' && (
            <DescriptiveStatistics
              key={chartId}
              chartId={chartId}
              gameDataId={gameDataId}
            />
          )}
          {vizType === 'boxPlot' && (
            <BoxPlot key={chartId} chartId={chartId} gameDataId={gameDataId} />
          )}
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
        <div className="absolute bottom-2 left-2 h-6 flex items-center justify-start gap-2">
          <button
            className="drag-handle w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center cursor-move z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ pointerEvents: 'auto' }}
            title="Drag to move"
          >
            <Move size={14} className="text-gray-600" />
          </button>
          {containerMode === 'viz' && (
            <button
              className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
              onClick={() => setContainerMode('settings')}
              type="button"
              title="Change dataset / chart type"
            >
              <Database size={14} className="text-gray-600" />
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
