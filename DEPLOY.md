# 🚀 Deploy to Vercel - 10 Minutes

Forget local setup! Let's deploy this live right now.

## Step 1: Create Supabase Database (3 minutes)

1. **Go to**: https://supabase.com
2. **Sign up** with GitHub (easiest)
3. **Click "New Project"**
4. **Fill in**:
   - Name: `labor-tracker`
   - Database Password: (create a strong one - SAVE IT!)
   - Region: Choose closest to you
   - Click "Create new project"
5. **Wait ~2 minutes** for database to provision

### Get Your Database URLs

1. Click **Settings** (gear icon in sidebar)
2. Click **Database**
3. Scroll to **Connection string**
4. Select **URI** tab
5. Copy the **Transaction mode** string
   - Should look like: `postgresql://postgres.[ref]:[password]@[region].pooler.supabase.com:6543/postgres?pgbouncer=true`
6. **IMPORTANT**: Replace `[password]` with your actual database password
7. **Save this** - you'll need it in a minute!

## Step 2: Get Resend API Key (1 minute)

1. **Go to**: https://resend.com
2. **Sign up** (free)
3. **Click "API Keys"** in sidebar
4. **Click "Create API Key"**
5. Name: `labor-tracker`
6. **Copy the key** (starts with `re_`)
7. **Save it** - you'll need it next!

## Step 3: Create GitHub Repository (1 minute)

1. **Go to**: https://github.com/new
2. **Repository name**: `labor-tracker`
3. **Keep it Private** (recommended)
4. **DON'T** initialize with README (we already have code)
5. **Click "Create repository"**

## Step 4: Push Your Code (2 minutes)

Open terminal in the `labor-tracker` folder and run:

```bash
cd C:\Users\mrjoj\consultant\labor-tracker

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Labor Tracker MVP"

# Add your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/labor-tracker.git

# Push to GitHub
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username!

If git asks for credentials, use your GitHub username and a **Personal Access Token** (not password).

## Step 5: Deploy to Vercel (3 minutes)

1. **Go to**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click "Add New"** → **"Project"**
4. **Import** your `labor-tracker` repository
5. Vercel will auto-detect Next.js - click **"Deploy"**
6. **WAIT!** Before it deploys, you need to add environment variables...

### Add Environment Variables in Vercel

Before clicking Deploy, click **"Environment Variables"**:

Add these 3 variables:

**Variable 1:**
- Name: `DATABASE_URL`
- Value: Your Supabase connection string from Step 1

**Variable 2:**
- Name: `RESEND_API_KEY`  
- Value: Your Resend API key from Step 2

**Variable 3:**
- Name: `NEXTAUTH_SECRET`
- Value: Any random string (or run `openssl rand -base64 32`)

**Variable 4:**
- Name: `NEXTAUTH_URL`
- Value: (Leave blank for now, we'll add it after deployment)

Now click **"Deploy"**!

## Step 6: Run Database Migration (2 minutes)

After deployment completes:

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Copy your `DATABASE_URL` value
4. **In your terminal**, run:

```bash
# Set the DATABASE_URL temporarily
$env:DATABASE_URL="your-supabase-url-here"

# Run migration
npx prisma migrate deploy

# Or if that doesn't work:
npx prisma db push
```

This creates the tables in your Supabase database.

## Step 7: Update NEXTAUTH_URL (1 minute)

1. Copy your Vercel deployment URL (like `https://labor-tracker-xyz.vercel.app`)
2. Go to Vercel → **Settings** → **Environment Variables**
3. **Edit** `NEXTAUTH_URL`
4. Set it to your deployment URL
5. **Redeploy** (Vercel → Deployments → Click ⋯ → Redeploy)

## ✅ YOU'RE LIVE!

Visit your Vercel URL: `https://your-app.vercel.app`

1. **Register** an account
2. **Create a job**
3. **Add updates**
4. **Test the email** (check your Resend dashboard)

## 🎉 What You Have Now

- ✅ **Live app** on the internet
- ✅ **Production database** (Supabase)
- ✅ **Real emails** (Resend)
- ✅ **Automatic deployments** (push to GitHub = auto-deploy)
- ✅ **HTTPS** and custom domain support
- ✅ **Free hosting** (Vercel free tier)

## 🔄 Making Changes

When you want to update the app:

```bash
# Make your changes to files
# Then:
git add .
git commit -m "Your change description"
git push

# Vercel automatically deploys!
```

## 🐛 Troubleshooting

### Can't login after deployment?
- Make sure you ran the database migration (Step 6)
- Check Vercel logs: Vercel → Project → Deployments → Click deployment → View Function Logs

### Email not working?
- Verify RESEND_API_KEY in Vercel environment variables
- Check Resend dashboard for errors
- Free Resend only sends to verified email addresses

### Database connection issues?
- Verify DATABASE_URL is correct in Vercel
- Make sure you replaced `[password]` with actual password
- Check Supabase project is running (not paused)

### Build fails?
- Check Vercel build logs
- Make sure all environment variables are set
- Try redeploying

## 📧 Next Steps

1. **Test everything** - create jobs, add updates, send emails
2. **Invite users** - share your Vercel URL
3. **Set up custom domain** (optional) - Vercel → Settings → Domains
4. **Schedule weekly emails** (future feature) - use Vercel Cron

---

**Your app is LIVE!** 🚀

No more local setup headaches. Everything is in the cloud and working!
