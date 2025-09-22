import React from 'react';

const StatusBadge = ({ 
  status, 
  children, 
  className = '',
  size = 'sm'
}) => {
  const statusConfig = {
    new: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      dot: 'bg-red-400'
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      dot: 'bg-yellow-400'
    },
    resolved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      dot: 'bg-green-400'
    },
    active: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      dot: 'bg-blue-400'
    },
    inactive: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      dot: 'bg-gray-400'
    },
    success: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      dot: 'bg-green-400'
    },
    error: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      dot: 'bg-red-400'
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      dot: 'bg-yellow-400'
    }
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm'
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${config.bg} ${config.text}
      ${sizeClasses[size]}
      ${className}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
      {children}
    </span>
  );
};

export default StatusBadge;