import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'default' 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover 
    ? 'hover:shadow-lg transition-shadow duration-200' 
    : '';

  return (
    <div className={`
      card
      ${paddingClasses[padding]}
      ${hoverClasses}
      ${className}
    `}>
      {children}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  className = '', 
  title, 
  subtitle,
  action 
}) => {
  return (
    <div className={`card-header ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {action && (
          <div>{action}</div>
        )}
      </div>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;