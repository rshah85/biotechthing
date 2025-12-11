'use client';

import { useState } from 'react';

export default function PositionCalculator() {
  const [price, setPrice] = useState('');
  const [result, setResult] = useState<{
    shares: number;
    totalCost: number;
    leftover: number;
    meetsMinimum: boolean;
  } | null>(null);

  const MAX_POSITION = 10000;
  const TRADING_FEE = 10;
  const MIN_PRICE = 10;

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();

    const stockPrice = parseFloat(price);
    if (isNaN(stockPrice) || stockPrice <= 0) {
      alert('Please enter a valid price');
      return;
    }

    const availableCapital = MAX_POSITION - TRADING_FEE;
    const shares = Math.floor(availableCapital / stockPrice);
    const totalCost = (shares * stockPrice) + TRADING_FEE;
    const leftover = MAX_POSITION - totalCost;
    const meetsMinimum = stockPrice >= MIN_PRICE;

    setResult({
      shares,
      totalCost,
      leftover,
      meetsMinimum
    });
  };

  const reset = () => {
    setPrice('');
    setResult(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Position Calculator</h2>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          <span className="font-semibold">Competition Rules:</span> Max $10,000 per position | $10 trading fee | Stocks must be ≥$10
        </p>
      </div>

      <form onSubmit={calculate} className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter Stock Price
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Calculate
          </button>
        </div>
      </form>

      {result && (
        <div className="space-y-4">
          {/* Warning if below minimum */}
          {!result.meetsMinimum && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-600 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <p className="font-bold text-red-800 dark:text-red-200 text-lg">DISQUALIFICATION RISK!</p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    This stock is BELOW the $10 minimum. Trading it will disqualify you from the competition!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className={`rounded-lg p-6 ${result.meetsMinimum ? 'bg-gray-50 dark:bg-gray-750' : 'bg-gray-100 dark:bg-gray-700 opacity-50'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Stock Price</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${parseFloat(price).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Shares to Buy</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {result.shares.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Cost</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${result.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Breakdown</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    ({result.shares} shares × ${parseFloat(price).toFixed(2)}) + $10 fee = ${result.totalCost.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Leftover Cash</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${result.leftover.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status badge */}
          {result.meetsMinimum && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-green-800 dark:text-green-200">Safe to Trade</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Stock meets the $10 minimum requirement
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            Calculate Another
          </button>
        </div>
      )}

      {!result && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="mb-2">Enter a stock price to calculate position size</p>
          <p className="text-sm">
            Max position: ${MAX_POSITION.toLocaleString()} | Trading fee: ${TRADING_FEE}
          </p>
        </div>
      )}
    </div>
  );
}
