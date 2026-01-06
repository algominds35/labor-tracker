# Labor Tracker MVP

A focused web app for construction contractors to track labor variance on active jobs.

## What It Does

- Track estimated vs actual labor hours
- Monitor job progress with weekly updates
- Get RED/YELLOW/GREEN status alerts
- Receive weekly email reports via Resend
- Simple, manual data entry (no integrations)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma + Supabase (PostgreSQL)
- NextAuth (email/password)
- Resend (email)
- Tailwind CSS

## Setup

### 1. Create a Supabase Project

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Wait for the database to be provisioned (~2 minutes)
4. Go to Settings > Database and copy:
   - **Connection string** (Transaction mode) → This is your `DATABASE_URL`
   - **Connection string** (Session mode) → This is your `DIRECT_URL`

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres.[your-project-ref]:[your-password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[your-project-ref]:[your-password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
RESEND_API_KEY="re_your_api_key_here"
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important:**
- Replace the connection strings with your actual Supabase values
- `DATABASE_URL` uses port 6543 (pgBouncer/transaction mode)
- `DIRECT_URL` uses port 5432 (direct connection for migrations)

To generate a NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

Get your Resend API key from: https://resend.com/api-keys

### 4. Set Up Database

```bash
npx prisma migrate dev
```

This will create all the necessary tables in your Supabase database.

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Usage

### First Time Setup

1. Go to `/register` and create an account
2. Sign in with your credentials

### Creating a Job

1. Click "New Job" from the home page
2. Enter:
   - Job name (e.g., "Downtown Office Electrical")
   - Estimated labor hours (e.g., 500)
   - Expected duration in weeks (e.g., 8)

### Weekly Updates

1. Click on a job from the list
2. Enter current totals:
   - Total actual labor hours used to date
   - Your judgment of % complete (0-100)
3. Click "Save Update"

The system automatically calculates:
- Planned labor vs actual
- Variance (hours and %)
- Projected overrun
- Status (GREEN/YELLOW/RED)

### Status Logic

- **GREEN**: ≤ 5% variance (on track)
- **YELLOW**: > 5% and ≤ 15% variance (monitor)
- **RED**: > 15% variance (action needed this week)

### Email Reports

- Click "Send Test Email" on any job detail page
- You'll receive a plain-text email with full variance analysis
- Email subject: `[STATUS] Job Name — labor vs progress`

### Archiving Jobs

- Click "Archive Job" to move completed jobs out of active view
- Archived jobs still appear at the bottom of the home page

## Project Structure

```
labor-tracker/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── register/       # User registration
│   │   └── jobs/           # Job CRUD + updates + email
│   ├── jobs/
│   │   ├── [id]/           # Job detail page
│   │   └── new/            # Create job page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   └── page.tsx            # Home (job list)
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── calculations.ts     # Variance calculation logic
│   ├── email.ts            # Resend email utilities
│   └── prisma.ts           # Prisma client singleton
├── prisma/
│   └── schema.prisma       # Database schema
└── middleware.ts           # Auth protection
```

## Core Calculation

```typescript
plannedLabor = estimatedHours × (percentComplete / 100)
laborVariance = actualHours − plannedLabor
variancePercent = (laborVariance / estimatedHours) × 100

projectedTotal = actualHours / (percentComplete / 100)
projectedOverrun = projectedTotal − estimatedHours
```

## What's NOT Included

This MVP intentionally excludes:
- CSV import
- Payroll/time tracking integration
- Estimating tools
- Project management features
- Crew management
- Role-based permissions
- Dashboards/charts
- Mobile app
- Real-time data
- AI features
- Benchmarking

## Production Deployment

Your Supabase database is already production-ready! Before deploying:

1. Set all environment variables in your hosting platform (Vercel, Railway, etc.)
2. Use your Supabase connection strings (already production-grade)
3. Set a secure `NEXTAUTH_SECRET` (different from dev)
4. Configure Resend with your domain for production emails
5. Run `npm run build` to verify
6. Deploy!

### Deploying to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables from your `.env` file
4. Deploy

Vercel will automatically run migrations on each deploy.

## License

MIT
