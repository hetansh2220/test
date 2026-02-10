# Expensio

A smart personal finance tracker built for Indians. Track spending, set budgets with the 50/30/20 rule, manage bills & EMIs, take on saving challenges, and get AI-powered financial advice — all in one place.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4, Montserrat & JetBrains Mono fonts
- **Auth & Database:** Firebase (Authentication + Firestore)
- **AI:** Google Gemini (gemini-flash-lite) for chat assistant & challenge generation
- **Data Fetching:** TanStack React Query 5
- **Charts:** Recharts 3
- **Icons:** React Icons (HeroIcons v2)

## Features

- **Dashboard** — Balance, income, expenses, savings, financial health score, alerts
- **Transactions** — Log income, expenses, and savings with categories (Needs / Wants / EMI)
- **Budget Tracking** — Monthly budgets using the 50/30/20 rule with visual progress bars
- **Bills & EMI Manager** — Track due dates, payment status, overdue alerts, EMI progress
- **Saving Challenges** — Gamified daily/weekly saving goals with check-in tracking
- **AI Finance Assistant** — Personalized advice powered by Gemini, context-aware to your finances
- **Financial Learning** — Bite-sized articles on budgeting, saving, and debt awareness
- **Dark / Light Theme** — Persistent theme toggle with system preference detection
- **Onboarding** — Personalized setup capturing profession, income type, and salary date

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication and Firestore enabled
- A Google AI (Gemini) API key

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (app)/           # Protected routes (dashboard, transactions, budget, etc.)
│   ├── (auth)/          # Public auth routes (login, signup)
│   ├── api/             # API routes (assistant, challenge suggestions)
│   ├── onboarding/      # First-time user setup
│   ├── layout.tsx       # Root layout with providers
│   └── page.tsx         # Landing page
├── components/layout/   # TopBar, BottomNav, Sidebar
├── hooks/               # useTransactions, useBudget, useBills, useChallenges
├── lib/
│   ├── firebase/        # Firebase config, auth, firestore utilities
│   ├── gemini/          # Gemini AI client
│   ├── constants/       # Routes, categories, professions, learning content
│   └── utils/           # Health score, budget alerts, currency formatting
├── providers/           # AuthProvider, QueryProvider, ThemeProvider, ToastProvider
└── types/               # TypeScript interfaces
```

## Financial Health Score

The health score (0–100) is calculated from four weighted factors:

| Factor                  | Weight |
| ----------------------- | ------ |
| Budget Adherence        | 30%    |
| Savings Rate (≥20%)     | 30%    |
| Bill Punctuality        | 20%    |
| Challenge Participation | 20%    |

**Labels:** Good (80+), Average (50–79), Poor (<50)

## License

Private project. All rights reserved.
