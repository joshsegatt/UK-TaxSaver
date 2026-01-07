# UK TaxSaver OS

**Bank-Grade Tax Optimization for UK Professionals.**

UK TaxSaver OS is a high-performance, secure financial dashboard designed to help UK high-earners optimize their tax liabilities. Built with a focus on data privacy, precision, and a premium user experience.

## 🚀 Key Features

*   **Real-Time Tax Engine**: Instant calculation of Income Tax, National Insurance, and Student Loan repayments for the 2024/25 tax year.
*   **AI-Powered Tax Analysis**: Secure backend integration with Google Gemini AI for personalized tax optimization suggestions.
*   **Bank-Grade Security**:
    *   **Stack Auth**: Secure, passwordless authentication.
    *   **Strict CSP**: Content Security Policy preventing unauthorized script execution.
    *   **Anti-Injection**: Advanced protection against browser extension overlays (e.g., LastPass).
    *   **Zod Validation**: Strict server-side input validation.
    *   **Rate Limiting**: 10 requests per hour via Upstash Redis to prevent abuse.
    *   **Server-Side API Keys**: All sensitive credentials remain on the server, never exposed to the browser.
*   **Cinematic Dashboard**: A "No-Scroll", glassmorphic interface designed for clarity and speed.
*   **Data Persistence**: Secure storage via Neon (PostgreSQL) and Prisma ORM.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
*   **Backend**: Server Actions, Next.js API Routes, Prisma ORM
*   **Database**: Neon (Serverless PostgreSQL)
*   **Auth**: Stack Auth
*   **AI**: Google Gemini AI (server-side only)
*   **Security**: Upstash Ratelimit, Zod, Helmet-grade Headers

## 🔐 Security & Environment Setup

### Required Environment Variables

```bash
cp .env.example .env.local  # Never commit .env.local!
```

| Variable | Required | Description | Get From |
|----------|----------|-------------|----------|
| `GEMINI_API_KEY` | ✅ | Google AI API key (server-side only) | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `DATABASE_URL` | ✅ | PostgreSQL connection string | [Neon](https://neon.tech) |
| `NEXT_PUBLIC_STACK_PROJECT_ID` | ✅ | Stack Auth project ID | [Stack Auth](https://stack-auth.com) |
| `STACK_SECRET_KEY` | ✅ | Stack Auth secret key | [Stack Auth](https://stack-auth.com) |
| `UPSTASH_REDIS_REST_URL` | ✅ | Redis URL for rate limiting | [Upstash Console](https://console.upstash.com) |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | Redis authentication token | [Upstash Console](https://console.upstash.com) |

### Rate Limiting

The AI tax analysis API is rate-limited to **10 requests per hour per IP** to prevent abuse and control costs.

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/uk-taxsaver.git
    cd uk-taxsaver
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    ```bash
    cp .env.example .env.local
    # Edit .env.local with your actual API keys and credentials
    ```

4.  **Set up Database**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000)

## 🚀 Production Deployment (Vercel)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Import your repository in Vercel Dashboard
   - Add all environment variables from `.env.example`
   - Deploy

3. **Configure Environment Variables** in Vercel Dashboard:
   ```bash
   GEMINI_API_KEY=your_actual_key
   DATABASE_URL=your_database_url
   NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_id
   STACK_SECRET_KEY=your_stack_secret
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   ```

## 📚 API Endpoints

### `/api/tax-analysis`

**POST** - Analyze tax scenario with AI
```typescript
{
  "income": 65000,
  "deductions": 5000,
  "filingStatus": "Individual"
}
```

**GET** - Health check
```json
{
  "status": "ready",
  "timestamp": "2024-01-07T12:00:00.000Z"
}
```

## 🔒 License

**Copyright © 2025 UK TaxSaver. All Rights Reserved.**

This project and its contents are proprietary and confidential. Unauthorized copying, distribution, modification, or use of this file, via any medium, is strictly prohibited.

