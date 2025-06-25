import { useState } from 'react';
import { BarChart } from './charts/BarChart';
import { Histogram } from './charts/Histogram';
import { ScatterPlot } from './charts/ScatterPlot';
import { Timeline } from './charts/Timeline';
import { ForceGraph } from './charts/ForceGraph';
import VizSetup from './VizSetup';

const VizContainer = () => {
  const [containerMode, setContainerMode] = useState<'settings' | 'viz'>(
    'settings',
  );
  const [vizType, setVizType] = useState<VizType>('bar');
  const [gameDataId, setGameDataId] = useState<string>('');
  // const [vizData, setVizData] = useState<GameData | null>(null);

  return (
    <div className="h-full">
      {containerMode === 'settings' ? (
        <VizSetup
          gameDataId={gameDataId}
          setGameDataId={setGameDataId}
          vizType={vizType}
          setVizType={setVizType}
          setContainerMode={setContainerMode}
        />
      ) : (
        <>
          {vizType === 'bar' && <BarChart gameDataId={gameDataId} />}
          {vizType === 'histogram' && <Histogram />}
          {vizType === 'scatter' && <ScatterPlot />}
          {vizType === 'timeline' && <Timeline />}
          {vizType === 'forceGraph' && <ForceGraph />}
        </>
      )}
    </div>
  );
};

export default VizContainer;
