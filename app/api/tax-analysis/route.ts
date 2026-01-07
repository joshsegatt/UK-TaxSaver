import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiting setup (using existing Upstash Redis)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Constants
const MAX_INCOME = 10_000_000;
const GEMINI_MODEL = 'gemini-1.5-pro'; // Use latest stable model version

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
  analytics: true,
});

export async function POST(req: NextRequest) {
  // Rate limiting
  const identifier = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
  
  if (!success) {
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
        limit,
        remaining: 0,
        reset: new Date(reset).toISOString()
      },
      { status: 429 }
    );
  }

  // Validate API key exists (server-side only)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('[Tax Analysis] GEMINI_API_KEY not configured');
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }

  try {
    // Parse and validate request
    const body = await req.json();
    const { income, deductions, filingStatus } = body;

    // Input validation
    if (typeof income !== 'number' || income < 0 || income > MAX_INCOME) {
      return NextResponse.json(
        { error: 'Invalid income value' },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Create prompt for tax analysis
    const prompt = `
You are a UK tax advisor. Analyze the following tax scenario for 2024/25:

Income: £${income.toLocaleString()}
Deductions: £${(deductions || 0).toLocaleString()}
Filing Status: ${filingStatus || 'Individual'}

Provide:
1. Estimated Income Tax
2. National Insurance contributions
3. Student Loan repayment (if applicable)
4. Tax optimization suggestions

Format response as JSON with these fields:
{
  "incomeTax": number,
  "nationalInsurance": number,
  "studentLoan": number,
  "totalTax": number,
  "suggestions": string[]
}
    `.trim();

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present (handles various formatting)
      const jsonMatch = text.match(/```(?:json)?\s*\n([\s\S]*?)\n\s*```/i);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('[Tax Analysis] Failed to parse Gemini response:', text);
      return NextResponse.json(
        { error: 'Failed to parse tax analysis' },
        { status: 500 }
      );
    }

    // Return analysis with rate limit info
    return NextResponse.json({
      analysis,
      rateLimit: {
        limit,
        remaining,
        reset: new Date(reset).toISOString()
      }
    });

  } catch (error) {
    console.error('[Tax Analysis] Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze tax information' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  return NextResponse.json({
    status: hasApiKey ? 'ready' : 'misconfigured',
    timestamp: new Date().toISOString()
  });
}
