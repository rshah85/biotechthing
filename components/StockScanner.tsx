'use client';

import { useState } from 'react';
import { Stock } from '@/types';

export default function StockScanner() {
  const [ticker, setTicker] = useState('');
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scanStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setLoading(true);
    setError('');
    setStock(null);

    try {
      const response = await fetch(`/api/stock/${ticker.toUpperCase()}`);

      if (!response.ok) {
        throw new Error('Stock not found');
      }

      const data = await response.json();
      setStock(data);
    } catch (err) {
      setError('Stock not found. Please check the ticker symbol.');
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = () => {
    if (!stock) return;

    const saved = localStorage.getItem('watchlist');
    const watchlist = saved ? JSON.parse(saved) : [];

    if (!watchlist.includes(stock.ticker)) {
      watchlist.push(stock.ticker);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      alert(`${stock.ticker} added to watchlist! Refresh the watchlist to see it.`);
    } else {
      alert(`${stock.ticker} is already in your watchlist`);
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return 'N/A';
  };

  const meetsMinimum = stock ? stock.currentPrice >= 10 : false;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Stock Scanner</h2>

      <form onSubmit={scanStock} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter ticker symbol (e.g., AGIO)"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !ticker.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {stock && (
        <div className="space-y-6">
          {/* Stock Header */}
          <div className="flex justify-between items-start pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stock.ticker}</h3>
              <p className="text-gray-600 dark:text-gray-400">{stock.companyName}</p>
            </div>
            <button
              onClick={addToWatchlist}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              + Add to Watchlist
            </button>
          </div>

          {/* Price Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Price</p>
              <p className={`text-2xl font-bold ${meetsMinimum ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                ${stock.currentPrice.toFixed(2)}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Change Today</p>
              <p className={`text-2xl font-bold ${stock.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volume</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(stock.volume / 1000000).toFixed(2)}M
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Cap</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMarketCap(stock.marketCap)}
              </p>
            </div>
          </div>

          {/* Eligibility Check */}
          <div className={`rounded-lg p-4 ${meetsMinimum ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{meetsMinimum ? '✓' : '✗'}</span>
              <div>
                <p className={`font-bold ${meetsMinimum ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                  {meetsMinimum ? 'ELIGIBLE FOR TRADING' : 'DISQUALIFICATION RISK'}
                </p>
                <p className={`text-sm ${meetsMinimum ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {meetsMinimum
                    ? `Stock price is above $10 minimum - safe to trade`
                    : `Stock price is BELOW $10 - trading this will disqualify you!`}
                </p>
              </div>
            </div>
          </div>

          {/* Position Sizing Quick View */}
          {meetsMinimum && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Quick Position Sizing (Max $10K)</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-700 dark:text-blue-300">Shares to Buy</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    {Math.floor(9990 / stock.currentPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700 dark:text-blue-300">Total Cost</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    ${(Math.floor(9990 / stock.currentPrice) * stock.currentPrice + 10).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700 dark:text-blue-300">Leftover</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    ${(10000 - (Math.floor(9990 / stock.currentPrice) * stock.currentPrice + 10)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date(stock.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      )}

      {!stock && !loading && !error && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">Enter a ticker symbol to scan</p>
          <p className="text-sm">Get real-time price, volume, market cap, and eligibility status</p>
        </div>
      )}
    </div>
  );
}
