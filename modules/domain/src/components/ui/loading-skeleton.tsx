
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "circle" | "button";
  count?: number;
}

export const LoadingSkeleton = ({ 
  className, 
  variant = "card", 
  count = 1 
}: LoadingSkeletonProps) => {
  const baseClasses = "animate-pulse bg-slate-700/50 rounded";
  
  const variantClasses = {
    card: "h-48 sm:h-56 w-full rounded-2xl",
    text: "h-4 w-full rounded",
    circle: "h-10 w-10 rounded-full",
    button: "h-10 w-24 rounded-lg",
  };

  const skeletonClass = cn(baseClasses, variantClasses[variant], className);

  if (count === 1) {
    return <div className={skeletonClass} role="status" aria-label="Loading..." />;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className={skeletonClass} 
          role="status" 
          aria-label={`Loading item ${index + 1} of ${count}`}
        />
      ))}
    </>
  );
};

// Specialized skeleton components
export const DomainCardSkeleton = () => (
  <div className="bg-slate-900/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 sm:p-6 space-y-4">
    <LoadingSkeleton variant="text" className="h-6 w-3/4" />
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <LoadingSkeleton variant="text" className="h-4 w-16" />
        <LoadingSkeleton variant="button" className="h-6 w-16 rounded-full" />
      </div>
      <div className="flex justify-between items-center">
        <LoadingSkeleton variant="text" className="h-4 w-20" />
        <LoadingSkeleton variant="text" className="h-4 w-24" />
      </div>
    </div>
    <div className="flex justify-end space-x-2 pt-2">
      <LoadingSkeleton variant="circle" />
      <LoadingSkeleton variant="circle" />
      <LoadingSkeleton variant="circle" />
    </div>
  </div>
);

export const DomainGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <DomainCardSkeleton key={index} />
    ))}
  </div>
);
