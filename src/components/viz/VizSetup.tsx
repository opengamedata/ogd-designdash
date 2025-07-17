import { useState } from 'react';
import { useEffect } from 'react';
import useDataStore from '../../store/useDataStore';
import Select from '../layout/Select';
import { VizType, VizTypeKey } from '../../constants/vizTypes';

interface VizSetupProps {
  gameDataId: string;
  setGameDataId: (gameDataId: string) => void;
  vizType: VizTypeKey;
  setVizType: (vizType: VizTypeKey) => void;
  setContainerMode: (containerMode: 'settings' | 'viz') => void;
}

const VizSetup = ({
  gameDataId,
  setGameDataId,
  vizType,
  setVizType,
  setContainerMode,
}: VizSetupProps) => {
  const { datasets, hasHydrated } = useDataStore();
  const [supportedChartTypes, setSupportedChartTypes] = useState<VizTypeKey[]>(
    [],
  );

  useEffect(() => {
    if (!gameDataId) return;
    const dataset = datasets[gameDataId];
    if (!dataset) return;
    const supportedChartTypes = dataset.supportedChartTypes;
    if (supportedChartTypes) {
      setSupportedChartTypes(supportedChartTypes);
    }
    if (!supportedChartTypes.includes(vizType)) {
      setVizType(supportedChartTypes[0]);
    }
  }, [gameDataId, datasets]);

  const visualize = () => {
    if (gameDataId) {
      setContainerMode('viz');
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 justify-center items-start p-4">
      {!hasHydrated && <div>Loading datasets...</div>}
      <Select
        className="w-full"
        label="Dataset"
        value={gameDataId}
        onChange={(value) => setGameDataId(value as string)}
        options={Object.fromEntries(
          Object.entries(datasets).map(([key]) => [key, key]),
        )}
      />
      <Select
        className="w-full"
        label="Chart Type"
        value={vizType}
        onChange={(value) => setVizType(value as VizTypeKey)}
        options={Object.fromEntries(
          supportedChartTypes.map((type) => [type, VizType[type]]),
        )}
      />
      <button
        disabled={!gameDataId || !vizType}
        className="px-2 py-1 bg-gray-700 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        onClick={visualize}
      >
        Apply
      </button>
    </div>
  );
};

export default VizSetup;
