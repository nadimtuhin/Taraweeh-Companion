'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

// Renamed from Progress to UIProgress to avoid naming conflicts
const UIProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { 
    value?: number | string | null 
  }
>(({ className, value, ...props }, ref) => {
  // Convert value to number and clamp between 0 and 100
  const progressValue = React.useMemo(() => {
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value || 0);
    // Handle NaN case
    if (isNaN(numValue)) return 0;
    // Clamp between 0 and 100
    return Math.min(Math.max(numValue, 0), 100);
  }, [value]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - progressValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
UIProgress.displayName = 'UIProgress';

// Export both the renamed component and the original name as an alias
export { UIProgress, UIProgress as Progress };
