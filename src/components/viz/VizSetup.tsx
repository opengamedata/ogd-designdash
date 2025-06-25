import useDataStore from '../../store/useDataStore';
import Select from '../layout/Select';

interface VizSetupProps {
  gameDataId: string;
  setGameDataId: (gameDataId: string) => void;
  vizType: VizType;
  setVizType: (vizType: VizType) => void;
  setContainerMode: (containerMode: 'settings' | 'viz') => void;
}

const VizSetup = ({
  gameDataId,
  setGameDataId,
  vizType,
  setVizType,
  setContainerMode,
}: VizSetupProps) => {
  const { datasets } = useDataStore();

  const visualize = () => {
    if (gameDataId) {
      setContainerMode('viz');
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 justify-center items-start p-4">
      <Select
        label="Chart Type"
        value={vizType}
        onChange={(value) => setVizType(value as VizType)}
        options={['bar', 'histogram', 'scatter', 'timeline', 'forceGraph']}
      />
      <Select
        label="Dataset"
        value={gameDataId}
        onChange={(value) => setGameDataId(value as string)}
        options={Object.keys(datasets)}
      />
      <button
        className="px-2 py-1 bg-gray-500 text-white rounded"
        onClick={visualize}
      >
        Apply
      </button>
    </div>
  );
};

export default VizSetup;
