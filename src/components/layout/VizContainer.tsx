import { useState } from 'react';
import { BarChart } from '../charts/BarChart';
import { Histogram } from '../charts/Histogram';
import { ScatterPlot } from '../charts/ScatterPlot';
import { Timeline } from '../charts/Timeline';
import { ForceGraph } from '../charts/ForceGraph';

type VizType = 'bar' | 'histogram' | 'scatter' | 'timeline' | 'forceGraph';

interface VizContainerProps {}

const VizContainer = ({}: VizContainerProps) => {
  const [dataSource, setDataSource] = useState<'file' | 'api'>('file');
  const [containerMode, setContainerMode] = useState<'settings' | 'viz'>(
    'settings',
  );
  const [vizType, setVizType] = useState<VizType>('bar');
  const [vizData, setVizData] = useState<any>(null);

  return (
    <div className="h-full">
      {containerMode === 'settings' ? (
        <VizSetup
          dataSource={dataSource}
          setDataSource={setDataSource}
          vizType={vizType}
          setVizType={setVizType}
          setContainerMode={setContainerMode}
        />
      ) : (
        <>
          {vizType === 'bar' && <BarChart />}
          {vizType === 'histogram' && <Histogram />}
          {vizType === 'scatter' && <ScatterPlot />}
          {vizType === 'timeline' && <Timeline />}
          {vizType === 'forceGraph' && <ForceGraph />}
        </>
      )}
    </div>
  );
};

interface VizSetupProps {
  dataSource: 'file' | 'api';
  setDataSource: (dataSource: 'file' | 'api') => void;
  vizType: VizType;
  setVizType: (vizType: VizType) => void;
  setContainerMode: (containerMode: 'settings' | 'viz') => void;
}

const VizSetup = ({
  dataSource,
  setDataSource,
  vizType,
  setVizType,
  setContainerMode,
}: VizSetupProps) => {
  const visualize = () => {
    setContainerMode('viz');
  };

  return (
    <div className="h-full flex flex-col gap-6 justify-center items-center">
      <div className="flex flex-col justify-start items-start">
        <label htmlFor="dataSource">Data Source</label>
        <select
          className="w-24 bg-gray-200"
          id="dataSource"
          value={dataSource}
          onChange={(e) => setDataSource(e.target.value as 'file' | 'api')}
        >
          <option value="file">File</option>
          <option value="api">API</option>
        </select>
      </div>
      <div className="flex flex-col justify-start items-start">
        <label htmlFor="vizType">Viz Type</label>
        <select
          className="w-24 bg-gray-200"
          id="vizType"
          value={vizType}
          onChange={(e) => setVizType(e.target.value as VizType)}
        >
          <option value="bar">Bar</option>
          <option value="histogram">Histogram</option>
          <option value="scatter">Scatter</option>
          <option value="timeline">Timeline</option>
          <option value="forceGraph">Force Graph</option>
        </select>
      </div>
      <button
        className="px-2 py-1 bg-gray-500 text-white rounded"
        onClick={visualize}
      >
        Apply
      </button>
    </div>
  );
};

export default VizContainer;
