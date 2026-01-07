/**
 * TaxAnalyzer Component - Example Integration
 * 
 * This is a reference implementation showing how to safely use the tax analysis API.
 * The component demonstrates:
 * - Secure API calls (no exposed API keys)
 * - Rate limit handling
 * - Error handling
 * - Loading states
 * 
 * Usage:
 * ```tsx
 * import { TaxAnalyzer } from '@/components/TaxAnalyzer';
 * 
 * function MyPage() {
 *   return <TaxAnalyzer />;
 * }
 * ```
 */

'use client';

import React, { useState } from 'react';
import { analyzeTax, TaxAnalysisError, type TaxAnalysis, type RateLimitInfo } from '@/lib/taxAnalysisClient';

export function TaxAnalyzer() {
  const [income, setIncome] = useState<number>(65000);
  const [deductions, setDeductions] = useState<number>(5000);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TaxAnalysis | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeTax({
        income,
        deductions,
        filingStatus: 'Individual',
      });

      setAnalysis(result.analysis);
      setRateLimit(result.rateLimit);
      
      console.log(`API calls remaining: ${result.rateLimit.remaining}/${result.rateLimit.limit}`);
    } catch (err) {
      if (err instanceof TaxAnalysisError) {
        setError(err.message);
        if (err.rateLimit) {
          setRateLimit(err.rateLimit);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">AI Tax Analysis</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Annual Income (£)
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
              max="10000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Deductions (£)
            </label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>

        {rateLimit && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
            <p className="text-blue-800">
              API Calls: {rateLimit.remaining}/{rateLimit.limit} remaining
              {rateLimit.remaining === 0 && (
                <span className="ml-2 text-red-600">
                  (Reset at {new Date(rateLimit.reset).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })})
                </span>
              )}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {analysis && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Analysis Results</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">Income Tax</p>
                <p className="text-2xl font-bold">£{analysis.incomeTax.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">National Insurance</p>
                <p className="text-2xl font-bold">£{analysis.nationalInsurance.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">Student Loan</p>
                <p className="text-2xl font-bold">£{analysis.studentLoan.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-md border-2 border-blue-200">
                <p className="text-sm text-blue-600">Total Tax</p>
                <p className="text-2xl font-bold text-blue-800">£{analysis.totalTax.toLocaleString()}</p>
              </div>
            </div>

            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Optimization Suggestions</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
        <p className="font-semibold mb-2">🔒 Security Features</p>
        <ul className="space-y-1 text-xs">
          <li>✅ API key never exposed to browser</li>
          <li>✅ Rate limited to 10 requests/hour per IP</li>
          <li>✅ Input validation on server-side</li>
          <li>✅ Secure server-to-server communication with Google AI</li>
        </ul>
      </div>
    </div>
  );
}
