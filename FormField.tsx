
import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, children, className = "", tooltip }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
        {tooltip && (
          <span className="ml-1 text-slate-400 cursor-help" title={tooltip}>
            (?)
          </span>
        )}
      </label>
      {children}
    </div>
  );
};

export default FormField;
