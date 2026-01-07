/**
 * Tax Analysis API Client
 * 
 * This utility provides a secure way to call the backend tax analysis API.
 * The API key is never exposed to the frontend - all AI requests go through
 * our secure backend endpoint.
 * 
 * @example
 * ```typescript
 * import { analyzeTax } from '@/lib/taxAnalysisClient';
 * 
 * try {
 *   const result = await analyzeTax({
 *     income: 65000,
 *     deductions: 5000,
 *     filingStatus: 'Individual'
 *   });
 *   
 *   console.log('Tax Analysis:', result.analysis);
 *   console.log('Rate Limit:', result.rateLimit);
 * } catch (error) {
 *   console.error('Analysis failed:', error);
 * }
 * ```
 */

export interface TaxAnalysisRequest {
  income: number;
  deductions?: number;
  filingStatus?: 'Individual' | 'Married' | 'Self-Employed';
}

export interface TaxAnalysis {
  incomeTax: number;
  nationalInsurance: number;
  studentLoan: number;
  totalTax: number;
  suggestions: string[];
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: string;
}

export interface TaxAnalysisResponse {
  analysis: TaxAnalysis;
  rateLimit: RateLimitInfo;
}

export class TaxAnalysisError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public rateLimit?: RateLimitInfo
  ) {
    super(message);
    this.name = 'TaxAnalysisError';
  }
}

/**
 * Call the secure backend API to analyze tax information using AI
 * 
 * @param params - Tax analysis parameters
 * @returns Promise with analysis results and rate limit information
 * @throws TaxAnalysisError if the request fails
 */
export async function analyzeTax(
  params: TaxAnalysisRequest
): Promise<TaxAnalysisResponse> {
  try {
    const response = await fetch('/api/tax-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        const resetTime = new Date(data.reset).toLocaleTimeString();
        throw new TaxAnalysisError(
          `Rate limit exceeded. Try again at ${resetTime}`,
          429,
          data
        );
      }

      throw new TaxAnalysisError(
        data.error || 'Analysis failed',
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof TaxAnalysisError) {
      throw error;
    }

    console.error('Tax analysis error:', error);
    throw new TaxAnalysisError(
      error instanceof Error ? error.message : 'Failed to analyze tax information'
    );
  }
}

/**
 * Check the health status of the tax analysis API
 * 
 * @returns Promise with API status information
 */
export async function checkTaxAnalysisHealth(): Promise<{
  status: 'ready' | 'misconfigured';
  timestamp: string;
}> {
  const response = await fetch('/api/tax-analysis');
  return response.json();
}
