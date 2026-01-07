# Security Fix Testing Guide

This document provides instructions for testing the security improvements made to remove the GEMINI_API_KEY from the frontend bundle.

## Prerequisites

Before testing, ensure you have:

1. **Environment Variables Set Up**
   ```bash
   cp .env.example .env.local
   ```

   Fill in `.env.local` with:
   - `GEMINI_API_KEY` - Your Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXT_PUBLIC_STACK_PROJECT_ID` - Stack Auth project ID
   - `STACK_SECRET_KEY` - Stack Auth secret key
   - `UPSTASH_REDIS_REST_URL` - Redis URL from [Upstash Console](https://console.upstash.com)
   - `UPSTASH_REDIS_REST_TOKEN` - Redis token

2. **Dependencies Installed**
   ```bash
   npm install
   ```

## Test Checklist

### ✅ 1. Verify API Key is NOT Exposed in Frontend

**Before the fix**: API key was visible in browser
**After the fix**: API key should be server-side only

**Test Steps**:
1. Start dev server: `npm run dev`
2. Open browser to http://localhost:3000
3. Open DevTools (F12) → Sources tab
4. Search for "GEMINI_API_KEY" or your actual API key value
5. **Expected Result**: No matches found in any JavaScript bundle

**Alternative Test**:
```bash
# Build the project
npm run build

# Search the build output for API key
grep -r "GEMINI_API_KEY" .next/static/ || echo "✅ API key not found in build"
```

---

### ✅ 2. Test Backend API Health Check

**Endpoint**: GET `/api/tax-analysis`

**Test Command**:
```bash
curl http://localhost:3000/api/tax-analysis
```

**Expected Response**:
```json
{
  "status": "ready",
  "timestamp": "2024-01-07T12:00:00.000Z"
}
```

If API key is missing:
```json
{
  "status": "misconfigured",
  "timestamp": "2024-01-07T12:00:00.000Z"
}
```

---

### ✅ 3. Test AI Tax Analysis Endpoint

**Endpoint**: POST `/api/tax-analysis`

**Test Command**:
```bash
curl -X POST http://localhost:3000/api/tax-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "income": 65000,
    "deductions": 5000,
    "filingStatus": "Individual"
  }'
```

**Expected Response**:
```json
{
  "analysis": {
    "incomeTax": 12345,
    "nationalInsurance": 5432,
    "studentLoan": 1234,
    "totalTax": 19011,
    "suggestions": [
      "Consider increasing pension contributions...",
      "Use Cycle to Work scheme..."
    ]
  },
  "rateLimit": {
    "limit": 10,
    "remaining": 9,
    "reset": "2024-01-07T13:00:00.000Z"
  }
}
```

---

### ✅ 4. Test Rate Limiting

**Test Steps**:
1. Make 10 successful requests to the API
2. On the 11th request, expect a 429 response

**Test Script**:
```bash
#!/bin/bash
echo "Testing rate limiting..."
for i in {1..11}; do
  echo "Request $i:"
  curl -s -w "\nStatus: %{http_code}\n" \
    -X POST http://localhost:3000/api/tax-analysis \
    -H "Content-Type: application/json" \
    -d '{"income": 50000}' | jq -r '.error // "Success"'
  echo "---"
  sleep 0.5
done
```

**Expected Output**:
- Requests 1-10: Success
- Request 11: `"Too many requests. Please try again later."`

---

### ✅ 5. Test Input Validation

**Invalid Income (negative)**:
```bash
curl -X POST http://localhost:3000/api/tax-analysis \
  -H "Content-Type: application/json" \
  -d '{"income": -1000}'
```

**Expected**: 400 Bad Request
```json
{
  "error": "Invalid income value"
}
```

**Invalid Income (too large)**:
```bash
curl -X POST http://localhost:3000/api/tax-analysis \
  -H "Content-Type: application/json" \
  -d '{"income": 20000000}'
```

**Expected**: 400 Bad Request
```json
{
  "error": "Invalid income value"
}
```

---

### ✅ 6. Test Frontend Integration (Optional)

If you've integrated the example component:

**Test Steps**:
1. Import the TaxAnalyzer component in a page
2. Fill in income and deductions
3. Click "Analyze with AI"
4. Verify results display correctly
5. Check rate limit counter updates
6. Try 11th request to see rate limit error

---

### ✅ 7. Verify Environment File Protection

**Test Command**:
```bash
# Try to commit a .env file (should be blocked by .gitignore)
touch .env.test-file
echo "GEMINI_API_KEY=fake-key" > .env.test-file
git add .env.test-file
git status | grep ".env.test-file"
rm .env.test-file
```

**Expected**: File should NOT be staged for commit

**Files Protected**:
- `.env`
- `.env.local`
- `.env.*.local`
- `*.log` files

**Not Protected** (intentionally):
- `.env.example` (should be committed)

---

## Security Verification

### ✅ Browser DevTools Check

1. Open application in browser
2. Open DevTools → Network tab
3. Trigger an API call to `/api/tax-analysis`
4. Inspect the request:
   - **Header**: Should NOT contain API key
   - **Payload**: Only contains income, deductions, filingStatus
   - **Response**: Contains analysis but NOT the API key

### ✅ CodeQL Security Scan

Already completed - **0 vulnerabilities found** ✅

To re-run locally:
```bash
# Install CodeQL CLI
# Then run analysis
codeql database create --language=javascript codeql-db
codeql database analyze codeql-db --format=sarif-latest --output=results.sarif
```

---

## Common Issues & Solutions

### Issue: "Service temporarily unavailable" (503)

**Cause**: `GEMINI_API_KEY` not set in environment

**Solution**:
1. Check `.env.local` exists and has `GEMINI_API_KEY=your-actual-key`
2. Restart dev server: `npm run dev`

### Issue: Rate limit not working

**Cause**: Upstash Redis not configured

**Solution**:
1. Get Redis credentials from [Upstash Console](https://console.upstash.com)
2. Add to `.env.local`:
   ```
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ```
3. Restart server

### Issue: "Invalid income value"

**Cause**: Income outside valid range (0 - £10,000,000)

**Solution**: Ensure income is between £0 and £10,000,000

---

## Production Testing (Vercel)

After deployment to Vercel:

1. **Set Environment Variables** in Vercel Dashboard:
   - All variables from `.env.example`

2. **Test Production API**:
   ```bash
   curl https://your-app.vercel.app/api/tax-analysis
   ```

3. **Verify API Key Not in Bundle**:
   - View Page Source
   - Search for "GEMINI_API_KEY"
   - Should find zero matches

4. **Test Rate Limiting**:
   - Works across all serverless function instances
   - Shared via Upstash Redis

---

## Success Criteria

All tests pass when:

- [x] API key NOT found in browser JavaScript bundles
- [x] Health check endpoint returns "ready"
- [x] Tax analysis endpoint returns valid AI analysis
- [x] Rate limiting blocks 11th request within 1 hour
- [x] Input validation rejects invalid data
- [x] Environment files protected by .gitignore
- [x] No sensitive data in error responses
- [x] CodeQL scan shows 0 vulnerabilities

**Result**: Security vulnerability successfully fixed! 🎉
