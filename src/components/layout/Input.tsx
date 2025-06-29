interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ label, value, onChange }: InputProps) => {
  return (
    <div>
      <label htmlFor={label}>{label}</label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        id={label}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
