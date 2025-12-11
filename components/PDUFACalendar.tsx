'use client';

import { useState, useEffect } from 'react';
import { PDUFAEntry } from '@/types';

export default function PDUFACalendar() {
  const [calendar, setCalendar] = useState<PDUFAEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    setLoading(true);
    try {
      const response = await fetch('/data/pdufa-calendar.json');
      const data = await response.json();
      setCalendar(data);
    } catch (error) {
      console.error('Error loading PDUFA calendar:', error);
    }
    setLoading(false);
  };

  const filteredCalendar = calendar.filter((entry) => {
    const pdufa_date = new Date(entry.pdufa_date);
    const today = new Date();
    const isPast = pdufa_date < today;

    if (filter === 'upcoming') return !isPast;
    if (filter === 'past') return isPast;
    return true;
  }).sort((a, b) => new Date(a.pdufa_date).getTime() - new Date(b.pdufa_date).getTime());

  const getDaysUntil = (dateString: string) => {
    const pdufa_date = new Date(dateString);
    const today = new Date();
    const diff = Math.ceil((pdufa_date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const addToWatchlist = (ticker: string) => {
    const saved = localStorage.getItem('watchlist');
    const watchlist = saved ? JSON.parse(saved) : [];

    if (!watchlist.includes(ticker)) {
      watchlist.push(ticker);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      alert(`${ticker} added to watchlist! Refresh the watchlist to see it.`);
    } else {
      alert(`${ticker} is already in your watchlist`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">PDUFA Calendar</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'past'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCalendar.map((entry) => {
          const daysUntil = getDaysUntil(entry.pdufa_date);
          const isPast = daysUntil < 0;
          const isUrgent = daysUntil >= 0 && daysUntil <= 14;

          return (
            <div
              key={`${entry.ticker}-${entry.pdufa_date}`}
              className={`border rounded-lg p-4 transition-all ${
                isPast
                  ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-750'
                  : isUrgent
                  ? 'border-orange-400 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{entry.ticker}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {entry.approvalType}
                    </span>
                    {isPast ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        PASSED
                      </span>
                    ) : isUrgent ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500 text-white animate-pulse">
                        {daysUntil}d UNTIL
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {daysUntil}d away
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{entry.companyName}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <span className="font-semibold">Drug:</span> {entry.drugName}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-semibold">Indication:</span> {entry.indication}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">PDUFA Date:</span> {formatDate(entry.pdufa_date)}
                    </span>
                  </div>

                  {entry.notes && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                      {entry.notes}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => addToWatchlist(entry.ticker)}
                  className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  + Watchlist
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCalendar.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No {filter !== 'all' ? filter : ''} PDUFA dates found</p>
        </div>
      )}
    </div>
  );
}
