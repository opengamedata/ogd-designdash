import { ChevronDown } from 'lucide-react';

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const Select = ({ label, value, onChange, options }: SelectProps) => {
  return (
    <div className="flex flex-col justify-start items-start w-full">
      <label htmlFor={label}>{label}</label>
      <div className="relative w-full">
        <select
          className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          id={label}
          defaultValue={undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
};

export default Select;
