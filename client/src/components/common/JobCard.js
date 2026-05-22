import React from 'react';
import { Link } from 'react-router-dom';

const TYPE_STYLES = {
  'full-time':  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'part-time':  'bg-blue-100   text-blue-700    dark:bg-blue-900/30    dark:text-blue-400',
  'contract':   'bg-orange-100 text-orange-700  dark:bg-orange-900/30  dark:text-orange-400',
  'internship': 'bg-purple-100 text-purple-700  dark:bg-purple-900/30  dark:text-purple-400',
  'remote':     'bg-teal-100   text-teal-700    dark:bg-teal-900/30    dark:text-teal-400',
};

const timeAgo = (date) => {
  const days = Math.floor((Date.now() - new Date(date)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const formatSalary = (min, max, currency = 'USD') => {
  const fmt = (n) => Number(n).toLocaleString();
  if (min && max) return `${fmt(min)}–${fmt(max)} ${currency}`;
  if (min) return `From ${fmt(min)} ${currency}`;
  if (max) return `Up to ${fmt(max)} ${currency}`;
  return null;
};

const JobCard = ({ job }) => {
  const { id, title, job_type, location, salary_min, salary_max, salary_currency, created_at, company, experience_level } = job;
  const salary = formatSalary(salary_min, salary_max, salary_currency);
  const initial = company?.company_name?.charAt(0)?.toUpperCase() || '?';

  return (
    <Link to={`/jobs/${id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-900/40 dark:to-accent-900/40 border border-gray-100 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
            <span className="font-display font-bold text-brand-600 dark:text-brand-400 text-lg">{initial}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-base leading-snug line-clamp-1">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                  {company?.company_name}
                  {company?.industry && <span className="text-gray-400"> · {company.industry}</span>}
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">{timeAgo(created_at)}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${TYPE_STYLES[job_type] || 'bg-gray-100 text-gray-600'}`}>
                {job_type?.replace('-', ' ')}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {location}
              </span>
              {experience_level && (
                <span className="text-xs text-gray-400 capitalize">{experience_level} level</span>
              )}
              {salary && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full">
                  💰 {salary}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
