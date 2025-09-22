import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const FormField = ({ 
  label, 
  type = 'text', 
  name, 
  register, 
  error, 
  placeholder, 
  required = false,
  showPasswordToggle = false,
  options = [],
  className = '',
  value,
  onChange
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const hasError = !!error;

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Text Input */}
        {type !== 'select' && type !== 'textarea' && (
          <input
            {...(register ? register(name) : {})}
            type={inputType}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`
              form-input
              ${hasError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
              ${showPasswordToggle ? 'pr-10' : ''}
            `}
          />
        )}

        {/* Select Input */}
        {type === 'select' && (
          <select
            {...(register ? register(name) : {})}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`
              form-input
              ${hasError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            `}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {/* Textarea */}
        {type === 'textarea' && (
          <textarea
            {...(register ? register(name) : {})}
            id={name}
            name={name}
            placeholder={placeholder}
            rows={4}
            value={value}
            onChange={onChange}
            className={`
              form-input resize-none
              ${hasError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            `}
          />
        )}

        {/* Password Toggle */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-md"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-gray-400" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <p className="form-error flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error.message}</span>
        </p>
      )}
    </div>
  );
};

export default FormField;