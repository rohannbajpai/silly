import React from 'react';
import { cn } from '@/lib/utils';

interface LevelCircleProps {
  level: number;
  maxLevel?: number;
  color?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'success' | 'warning' | 'chart1' | 'chart2' | 'chart3' | 'chart4' | 'chart5';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

const LevelCircle = ({ 
  level, 
  maxLevel = 5, 
  color = 'primary', 
  size = 'md',
  className,
  icon
}: LevelCircleProps) => {
  // Normalize level to be between 0 and maxLevel
  const normalizedLevel = Math.max(0, Math.min(level, maxLevel));
  
  // Calculate the ring color based on level completion
  const getColorClass = () => {
    const colorMap = {
      primary: {
        bg: 'bg-primary/10',
        ring: 'ring-primary',
        text: 'text-primary',
      },
      secondary: {
        bg: 'bg-secondary/10',
        ring: 'ring-secondary',
        text: 'text-secondary',
      },
      accent: {
        bg: 'bg-accent/10',
        ring: 'ring-accent',
        text: 'text-accent',
      },
      destructive: {
        bg: 'bg-destructive/10',
        ring: 'ring-destructive',
        text: 'text-destructive',
      },
      success: {
        bg: 'bg-success/10',
        ring: 'ring-success',
        text: 'text-success',
      },
      warning: {
        bg: 'bg-warning/10',
        ring: 'ring-warning',
        text: 'text-warning',
      },
      chart1: {
        bg: 'bg-chart-1/10',
        ring: 'ring-chart-1',
        text: 'text-chart-1',
      },
      chart2: {
        bg: 'bg-chart-2/10',
        ring: 'ring-chart-2',
        text: 'text-chart-2',
      },
      chart3: {
        bg: 'bg-chart-3/10',
        ring: 'ring-chart-3',
        text: 'text-chart-3',
      },
      chart4: {
        bg: 'bg-chart-4/10',
        ring: 'ring-chart-4',
        text: 'text-chart-4',
      },
      chart5: {
        bg: 'bg-chart-5/10',
        ring: 'ring-chart-5',
        text: 'text-chart-5',
      },
    };
    
    return colorMap[color];
  };
  
  const getSizeClass = () => {
    const sizeMap = {
      sm: 'w-12 h-12 text-sm ring-2',
      md: 'w-16 h-16 text-base ring-2',
      lg: 'w-20 h-20 text-lg ring-4',
    };
    
    return sizeMap[size];
  };
  
  const { bg, ring, text } = getColorClass();
  const sizeClass = getSizeClass();
  
  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center font-bold relative',
        bg, ring, text, sizeClass, className
      )}
    >
      {icon ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {icon}
        </div>
      ) : (
        level
      )}
      
      {/* Small crown badge for max level */}
      {level === maxLevel && (
        <div className="absolute -top-1 -right-1 bg-warning text-warning-foreground rounded-full w-6 h-6 flex items-center justify-center shadow-md">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z" 
              fill="currentColor" 
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default LevelCircle; 