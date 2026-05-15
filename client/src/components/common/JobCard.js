import React from 'react';
import { Link } from 'react-router-dom';

const typeColors = {
  'full-time': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'part-time': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'contract': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'internship': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'remote': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

const formatSalary = (min, max, currency = 'USD') => {
  if (!min && !max) return null;
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max)}`;
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const JobCard = ({ job, compact = false }) => {
  const { id, title, job_type, location, salary_min, salary_max, salary_currency, created_at, company } = job;

  return (
    <Link to={`/jobs/${id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all duration-200 animate-fade-in">
        <div className="flex items-start gap-4">
          {/* Company logo */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900 dark:to-accent-900 flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-gray-700">
            {company?.logo_url ? (
              <img src={company.logo_url} alt={company.company_name} className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <span className="text-brand-600 font-display font-bold text-lg">
                {company?.company_name?.charAt(0) || '?'}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{company?.company_name}</p>
          </div>

          <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(created_at)}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[job_type] || 'bg-gray-100 text-gray-600'}`}>
            {job_type?.replace('-', ' ')}
          </span>

          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {location}
          </span>

          {formatSalary(salary_min, salary_max, salary_currency) && (
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {formatSalary(salary_min, salary_max, salary_currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
