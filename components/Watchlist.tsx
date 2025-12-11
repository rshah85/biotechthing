'use client';

import { useState, useEffect } from 'react';
import { WatchlistStock } from '@/types';

interface WatchlistProps {
  onRefresh: () => void;
}

export default function Watchlist({ onRefresh }: WatchlistProps) {
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>([]);
  const [sortBy, setSortBy] = useState<'pdufa' | 'price' | 'change' | 'ticker'>('pdufa');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem('watchlist');
      if (saved) {
        const tickers = JSON.parse(saved);
        await fetchStockData(tickers);
      } else {
        // Load default stocks
        const defaultTickers = ['AGIO', 'CYTK', 'CORT', 'DNLI', 'TVTX'];
        await fetchStockData(defaultTickers);
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
    setLoading(false);
  };

  const fetchStockData = async (tickers: string[]) => {
    try {
      const response = await fetch('/api/stocks/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers })
      });

      if (response.ok) {
        const { stocks } = await response.json();

        // Load PDUFA data
        const pdufa_response = await fetch('/data/pdufa-calendar.json');
        const pdufa_data = await pdufa_response.json();

        // Merge stock data with PDUFA data
        const enrichedStocks = stocks.map((stock: WatchlistStock) => {
          const pdufa_entry = pdufa_data.find((p: any) => p.ticker === stock.ticker);
          if (pdufa_entry) {
            const pdufa_date = new Date(pdufa_entry.pdufa_date);
            const today = new Date();
            const daysUntil = Math.ceil((pdufa_date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            return {
              ...stock,
              pdufa_date: pdufa_entry.pdufa_date,
              drugName: pdufa_entry.drugName,
              indication: pdufa_entry.indication,
              daysUntilPDUFA: daysUntil
            };
          }
          return stock;
        });

        setWatchlist(enrichedStocks);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const removeStock = (ticker: string) => {
    const updated = watchlist.filter(s => s.ticker !== ticker);
    setWatchlist(updated);
    const tickers = updated.map(s => s.ticker);
    localStorage.setItem('watchlist', JSON.stringify(tickers));
  };

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    switch (sortBy) {
      case 'pdufa':
        if (!a.daysUntilPDUFA) return 1;
        if (!b.daysUntilPDUFA) return -1;
        return a.daysUntilPDUFA - b.daysUntilPDUFA;
      case 'price':
        return b.currentPrice - a.currentPrice;
      case 'change':
        return b.changePercent - a.changePercent;
      case 'ticker':
        return a.ticker.localeCompare(b.ticker);
      default:
        return 0;
    }
  });

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return 'N/A';
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Watchlist</h2>
        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="pdufa">Sort by PDUFA Date</option>
            <option value="price">Sort by Price</option>
            <option value="change">Sort by % Change</option>
            <option value="ticker">Sort by Ticker</option>
          </select>
          <button
            onClick={() => { loadWatchlist(); onRefresh(); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No stocks in watchlist</p>
          <p className="text-sm mt-2">Add stocks using the Stock Scanner below</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Ticker</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Company</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Change</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Volume</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">PDUFA Date</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Days Until</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedWatchlist.map((stock) => {
                const meetsMinimum = stock.currentPrice >= 10;
                const isPast = stock.daysUntilPDUFA !== undefined && stock.daysUntilPDUFA < 0;

                return (
                  <tr
                    key={stock.ticker}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-bold text-gray-900 dark:text-white">{stock.ticker}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{stock.companyName}</p>
                        {stock.drugName && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{stock.drugName}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`font-semibold ${meetsMinimum ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                        ${stock.currentPrice.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`font-medium ${stock.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-sm text-gray-700 dark:text-gray-300">
                      {(stock.volume / 1000000).toFixed(2)}M
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {stock.pdufa_date || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {stock.daysUntilPDUFA !== undefined ? (
                        <span className={`font-medium ${isPast ? 'text-gray-500' : stock.daysUntilPDUFA <= 7 ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                          {isPast ? 'PASSED' : `${stock.daysUntilPDUFA}d`}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {meetsMinimum ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          ✓ Safe
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          ✗ DQ Risk
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => removeStock(stock.ticker)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
