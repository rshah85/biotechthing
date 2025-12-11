'use client';

import { useState, useEffect } from 'react';
import Watchlist from '@/components/Watchlist';
import PDUFACalendar from '@/components/PDUFACalendar';
import StockScanner from '@/components/StockScanner';
import PositionCalculator from '@/components/PositionCalculator';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Biotech FDA Tracker
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Competition: Dec 8, 2025 - Jan 30, 2026 | Starting Capital: $100,000
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Competition Stats */}
              <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <p className="text-xs text-blue-700 dark:text-blue-300">Max Position</p>
                  <p className="font-bold text-blue-900 dark:text-blue-100">$10,000</p>
                </div>
                <div className="w-px h-8 bg-blue-300 dark:bg-blue-700"></div>
                <div className="text-center">
                  <p className="text-xs text-blue-700 dark:text-blue-300">Min Price</p>
                  <p className="font-bold text-blue-900 dark:text-blue-100">$10.00</p>
                </div>
                <div className="w-px h-8 bg-blue-300 dark:bg-blue-700"></div>
                <div className="text-center">
                  <p className="text-xs text-blue-700 dark:text-blue-300">Trading Fee</p>
                  <p className="font-bold text-blue-900 dark:text-blue-100">$10</p>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Watchlist Section */}
          <section>
            <Watchlist key={refreshKey} onRefresh={handleRefresh} />
          </section>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stock Scanner */}
            <section>
              <StockScanner />
            </section>

            {/* Position Calculator */}
            <section>
              <PositionCalculator />
            </section>
          </div>

          {/* PDUFA Calendar */}
          <section>
            <PDUFACalendar />
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built for StockTrak Competition | Data from Yahoo Finance
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Refresh the watchlist regularly for accurate prices. PDUFA dates can change - verify with FDA.
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-4">
              ⚠️ REMINDER: Trading stocks below $10 will disqualify you from the competition!
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
