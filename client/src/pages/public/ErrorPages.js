import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="font-display text-6xl font-bold text-gray-900 dark:text-white mb-3">404</h1>
        <h2 className="font-semibold text-xl text-gray-700 dark:text-gray-300 mb-3">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            ← Go Back
          </button>
          <Link to="/" className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ServerError = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
    <div className="text-center max-w-md animate-fade-in">
      <div className="text-8xl mb-6">⚠️</div>
      <h1 className="font-display text-6xl font-bold text-gray-900 dark:text-white mb-3">500</h1>
      <h2 className="font-semibold text-xl text-gray-700 dark:text-gray-300 mb-3">Server Error</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        Something went wrong on our end. Please try again in a few moments.
      </p>
      <Link to="/" className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors inline-block">
        Back to Home
      </Link>
    </div>
  </div>
);
