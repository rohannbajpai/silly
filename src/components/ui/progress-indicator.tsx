import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  value: number;
  max: number;
  color?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'success' | 'warning';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const ProgressIndicator = ({
  value,
  max,
  color = 'primary',
  showLabel = false,
  size = 'md',
  animated = false,
}: ProgressIndicatorProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    destructive: 'bg-destructive',
    success: 'bg-success',
    warning: 'bg-warning',
  };
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };
  
  return (
    <div className="w-full">
      <div className="bg-muted rounded-full overflow-hidden">
        <div 
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full ${animated ? 'transition-all duration-500 ease-out' : ''}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showLabel && (
        <div className="mt-1 text-xs text-muted-foreground flex justify-between">
          <span>{value} / {max}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator; 