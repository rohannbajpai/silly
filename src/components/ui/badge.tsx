import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-transparent",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        accent: "bg-accent text-accent-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        chart1: "bg-chart-1 text-white",
        chart2: "bg-chart-2 text-white",
        chart3: "bg-chart-3 text-white",
        chart4: "bg-chart-4 text-white",
        chart5: "bg-chart-5 text-white",
      },
      size: {
        default: "h-6 px-3 py-1 text-xs",
        sm: "h-5 px-2 text-xs",
        lg: "h-8 px-4 text-sm",
        circle: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  count?: number;
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, count, icon, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {count !== undefined ? count : props.children}
    </div>
  );
}

export { Badge, badgeVariants }; 