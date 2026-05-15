import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = 'md', text = '' }) => {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className={`${sizeMap.lg} border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin`} />
          <p className="text-gray-500 dark:text-gray-400 font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <div className={`${sizeMap[size]} border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin`} />
      {text && <span className="text-sm text-gray-500">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
