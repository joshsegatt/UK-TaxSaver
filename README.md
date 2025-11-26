# UK TaxSaver OS

**Bank-Grade Tax Optimization for UK Professionals.**

UK TaxSaver OS is a high-performance, secure financial dashboard designed to help UK high-earners optimize their tax liabilities. Built with a focus on data privacy, precision, and a premium user experience.

## 🚀 Key Features

*   **Real-Time Tax Engine**: Instant calculation of Income Tax, National Insurance, and Student Loan repayments for the 2024/25 tax year.
*   **Bank-Grade Security**:
    *   **Stack Auth**: Secure, passwordless authentication.
    *   **Strict CSP**: Content Security Policy preventing unauthorized script execution.
    *   **Anti-Injection**: Advanced protection against browser extension overlays (e.g., LastPass).
    *   **Zod Validation**: Strict server-side input validation.
*   **Cinematic Dashboard**: A "No-Scroll", glassmorphic interface designed for clarity and speed.
*   **Data Persistence**: Secure storage via Neon (PostgreSQL) and Prisma ORM.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
*   **Backend**: Server Actions, Prisma ORM
*   **Database**: Neon (Serverless PostgreSQL)
*   **Auth**: Stack Auth
*   **Security**: Upstash Ratelimit, Zod, Helmet-grade Headers

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/uk-taxsaver.git
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file with the following:
    ```env
    DATABASE_URL="postgresql://..."
    NEXT_PUBLIC_STACK_PROJECT_ID="..."
    STACK_SECRET_KEY="..."
    UPSTASH_REDIS_REST_URL="..."
    UPSTASH_REDIS_REST_TOKEN="..."
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🔒 License

**Copyright © 2025 UK TaxSaver. All Rights Reserved.**

This project and its contents are proprietary and confidential. Unauthorized copying, distribution, modification, or use of this file, via any medium, is strictly prohibited.
