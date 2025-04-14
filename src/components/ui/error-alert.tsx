import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorAlertProps {
  message: string;
  className?: string;
}

export function ErrorAlert({ message, className }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-lg mb-6',
        className
      )}
      data-testid="error-alert"
    >
      <AlertCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
} 