import React from 'react';
import { cn } from '@/lib/utils';

type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  className?: string;
};

export function ProgressIndicator({ currentStep, totalSteps, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("w-full mb-6", className)}>
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`h-1 flex-1 mx-0.5 rounded-full ${
              index < currentStep ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <div className="text-sm text-muted-foreground text-right">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}

export default ProgressIndicator; 