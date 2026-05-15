import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} />
);

export const JobCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
    <div className="flex items-start gap-4">
      <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="mt-4 flex gap-2">
      <Skeleton className="h-7 w-20 rounded-full" />
      <Skeleton className="h-7 w-24 rounded-full" />
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
    <Skeleton className="h-4 w-24 mb-3" />
    <Skeleton className="h-8 w-16" />
  </div>
);

export default Skeleton;
