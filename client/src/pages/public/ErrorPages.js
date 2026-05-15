import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="font-display text-9xl font-bold text-brand-200 dark:text-brand-900 select-none">404</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mt-4">Page not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Go back
          </button>
          <Link to="/" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ServerError = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
    <div className="text-center animate-fade-in">
      <div className="font-display text-9xl font-bold text-red-200 dark:text-red-900 select-none">500</div>
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mt-4">Something went wrong</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-sm mx-auto">
        We're experiencing technical difficulties. Please try again later.
      </p>
      <Link to="/" className="inline-block mt-8 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
        Go home
      </Link>
    </div>
  </div>
);
