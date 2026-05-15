import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">Z</span>
            </div>
            <span className="font-display font-bold text-xl text-white">Zidra Job Portal</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Connecting Somalia's talent with top employers. Your career journey starts here.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">For Job Seekers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">My Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">For Employers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-white transition-colors">Post a Job</Link></li>
            <li><Link to="/employer/dashboard" className="hover:text-white transition-colors">Employer Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm">© 2024 Zidra Job Portal. All rights reserved.</p>
        <p className="text-sm">Built with ❤️ in Somalia</p>
      </div>
    </div>
  </footer>
);

export default Footer;
