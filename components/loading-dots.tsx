import React from 'react';

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const dotClass = `${sizeClasses[size]} bg-primary rounded-full animate-pulse`;

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <div 
        className={dotClass} 
        style={{ animationDelay: '0ms', animationDuration: '1s' }}
      />
      <div 
        className={dotClass} 
        style={{ animationDelay: '333ms', animationDuration: '1s' }}
      />
      <div 
        className={dotClass} 
        style={{ animationDelay: '666ms', animationDuration: '1s' }}
      />
    </div>
  );
}; 