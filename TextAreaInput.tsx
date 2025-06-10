
import React from 'react';

interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ id, className = "", ...props }) => {
  return (
    <textarea
      id={id}
      rows={3}
      className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400 ${className}`}
      {...props}
    />
  );
};

export default TextAreaInput;
