import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center">
              <span className="text-white font-display font-bold text-base">Z</span>
            </div>
            <span className="font-display font-bold text-xl text-white">Zidra</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs text-gray-400">
            Somalia's #1 job portal connecting talented professionals with top employers across the country and beyond.
          </p>
          <div className="flex items-center gap-1.5 mt-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Live & Active</span>
          </div>
        </div>

        {/* Job Seekers */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">For Job Seekers</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/jobs" className="hover:text-white transition-colors hover:pl-1 duration-200 block">Browse Jobs</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors hover:pl-1 duration-200 block">Create Account</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors hover:pl-1 duration-200 block">My Dashboard</Link></li>
            <li><Link to="/saved-jobs" className="hover:text-white transition-colors hover:pl-1 duration-200 block">Saved Jobs</Link></li>
            <li><Link to="/applied-jobs" className="hover:text-white transition-colors hover:pl-1 duration-200 block">My Applications</Link></li>
          </ul>
        </div>

        {/* Employers */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">For Employers</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/register" className="hover:text-white transition-colors hover:pl-1 duration-200 block">Post a Job</Link></li>
            <li><Link to="/employer/dashboard" className="hover:text-white transition-colors hover:pl-1 duration-200 block">Employer Dashboard</Link></li>
            <li><Link to="/employer/company" className="hover:text-white transition-colors hover:pl-1 duration-200 block">Company Profile</Link></li>
            <li><Link to="/employer/jobs" className="hover:text-white transition-colors hover:pl-1 duration-200 block">My Job Posts</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span>📍</span> Mogadishu, Somalia
            </li>
            <li className="flex items-center gap-2">
              <span>📧</span> support@zidra.so
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span> +252 61 000 0000
            </li>
          </ul>
          <div className="flex items-center gap-3 mt-5">
            {['🐦','💼','📘'].map((icon, i) => (
              <button key={i} className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-base transition-colors">
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500">© 2024 Zidra Job Portal. All rights reserved.</p>
        <p className="text-xs text-gray-500">Built with ❤️ for Somalia 🇸🇴</p>
      </div>
    </div>
  </footer>
);

export default Footer;
