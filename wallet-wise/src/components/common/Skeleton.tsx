import React from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/60 dark:bg-muted/40", className)}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border p-6 space-y-4 bg-background/50">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-[160px]" />
        <Skeleton className="h-3 w-[100px]" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-[250px]" />
        <Skeleton className="h-9 w-[120px]" />
      </div>
      <div className="rounded-xl border overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[60px]" />
            <Skeleton className="h-4 w-[90px]" />
          </div>
        </div>
        <div className="divide-y">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-5 w-[140px]" />
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[70px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border p-6 space-y-6 bg-background/50 h-[380px] flex flex-col justify-between">
      <div className="space-y-2">
        <Skeleton className="h-5 w-[180px]" />
        <Skeleton className="h-3 w-[260px]" />
      </div>
      <div className="flex-1 flex items-end gap-4 px-2 pt-6">
        {[40, 70, 50, 85, 30, 95, 60, 45, 80].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton className="w-full rounded-t-md" style={{ height: `${h}%` }} />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
