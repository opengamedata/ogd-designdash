import { useEffect, useState } from 'react';
import useLayoutStore from '../store/useLayoutStore';

const useChartOption = <T,>(chartId: string, key: string, initial: T): [T, (v: T) => void] => {
  const getOption = useLayoutStore((state) => state.getChartOption);
  const setOption = useLayoutStore((state) => state.setChartOption);
  const [value, setValue] = useState<T>(() => {
    const val = getOption(chartId, key);
    return val !== undefined ? (val as T) : initial;
  });

  useEffect(() => {
    const stored = getOption(chartId, key);
    if (stored !== undefined) {
      setValue(stored as T);
    }
  }, [chartId]);

  useEffect(() => {
    setOption(chartId, key, value);
  }, [value]);

  return [value, setValue];
};

export default useChartOption;
