# Quick Setup Guide

## Step-by-Step Setup (5 minutes)

### 1. Supabase Setup

1. Go to **https://supabase.com**
2. Click "Start your project" → Sign up (free)
3. Click "New Project"
4. Enter:
   - **Name**: labor-tracker (or whatever you want)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
   - **Plan**: Free
5. Click "Create new project"
6. Wait ~2 minutes for provisioning

### 2. Get Database Connection Strings

1. In your Supabase project, go to **Settings** (gear icon) → **Database**
2. Scroll down to **Connection string**
3. Select **URI** mode
4. Copy the string for **Transaction mode** - this is your `DATABASE_URL`
   - Should look like: `postgresql://postgres.[ref]:[password]@[region].pooler.supabase.com:6543/postgres`
   - **Replace `[password]` with your actual database password!**
5. Copy the string for **Session mode** - this is your `DIRECT_URL`
   - Should look like: `postgresql://postgres.[ref]:[password]@[region].pooler.supabase.com:5432/postgres`
   - **Replace `[password]` with your actual database password!**

### 3. Get Resend API Key

1. Go to **https://resend.com**
2. Sign up for free
3. Go to **API Keys**
4. Click "Create API Key"
5. Name it "labor-tracker-dev"
6. Copy the API key (starts with `re_`)

### 4. Create .env File

In the `labor-tracker` directory, create a file named `.env`:

```env
DATABASE_URL="postgresql://postgres.[your-ref]:[your-password]@[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[your-ref]:[your-password]@[region].pooler.supabase.com:5432/postgres"
RESEND_API_KEY="re_your_actual_key_here"
NEXTAUTH_SECRET="any-random-string-for-now"
NEXTAUTH_URL="http://localhost:3000"
```

**Replace the placeholder values with your actual credentials!**

### 5. Install & Run

```bash
# Install dependencies
npm install

# Set up database tables
npx prisma migrate dev

# Start the app
npm run dev
```

### 6. Create Your Account

1. Open **http://localhost:3000**
2. You'll be redirected to login
3. Click "Register"
4. Create your account
5. Sign in
6. Start tracking jobs!

## Troubleshooting

### Migration fails

- Check that your `DATABASE_URL` and `DIRECT_URL` are correct
- Make sure you replaced `[password]` with your actual Supabase password
- Verify your Supabase project is fully provisioned (green status)

### Can't login

- Make sure you registered an account first
- Check that `NEXTAUTH_SECRET` is set in `.env`

### Email not sending

- Verify your `RESEND_API_KEY` is correct
- Free Resend accounts can only send to verified email addresses
- Verify your email in Resend dashboard first

### Build errors

- Make sure all dependencies are installed: `npm install`
- Try deleting `.next` folder and rebuilding: `rm -rf .next && npm run build`

## Next Steps

Once running:

1. **Create a job** - Click "New Job" and enter project details
2. **Add weekly update** - Click the job, enter actual hours and % complete
3. **Test email** - Click "Send Test Email" to see the variance report
4. **Archive completed jobs** - Click "Archive Job" when done

## Production Deployment

See the main README.md for deployment instructions.
