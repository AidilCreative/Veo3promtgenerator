import React from 'react';

interface Option {
  value: string;
  label?: string; // For AspectRatioOption, now optional
  label_id?: string; // For CameraMovementOption (Indonesian)
  label_en?: string; // For CameraMovementOption (English, used if label_id not present)
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  options: Option[];
  useIndonesianLabel?: boolean; // Flag to use label_id if available
}

const SelectInput: React.FC<SelectInputProps> = ({ id, options, className = "", useIndonesianLabel = false, ...props }) => {
  return (
    <select
      id={id}
      className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 ${className}`}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value} className="bg-slate-700 text-slate-100">
          {useIndonesianLabel && option.label_id ? option.label_id : (option.label_en || option.label)}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;