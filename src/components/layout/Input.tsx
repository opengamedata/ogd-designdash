import { useEffect, useState } from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: boolean;
}

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  debounce = false,
}: InputProps) => {
  const [internalValue, setInternalValue] = useState(value);

  // Sync internal value with prop when parent changes it
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce only user input
  useEffect(() => {
    if (internalValue === value) return; // Don't call onChange if value is from parent
    const timer = setTimeout(
      () => {
        onChange(internalValue);
      },
      debounce ? 200 : 0,
    );
    return () => clearTimeout(timer);
  }, [internalValue, debounce]);

  return (
    <div>
      <label className="text-sm text-gray-700" htmlFor={label}>
        {label}
      </label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        id={label}
        value={internalValue}
        placeholder={placeholder ?? 'Type...'}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={() => onChange(internalValue)}
      />
    </div>
  );
};

export default Input;
