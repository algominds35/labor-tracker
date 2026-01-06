# ⚡ QUICKSTART - Run in 60 Seconds

No Supabase or Resend account needed! Run locally with SQLite and demo email mode.

## 🚀 Run Now

```bash
cd labor-tracker

# Install dependencies (30 seconds)
npm install

# Set up local database (5 seconds)
npx prisma migrate dev --name init

# Start the app (immediate)
npm run dev
```

## ✅ Open & Use

1. **Open**: http://localhost:3000
2. **Register**: Create an account (any email, any password)
3. **Create a job**: Click "New Job"
   - Name: "Test Project"
   - Hours: 500
   - Weeks: 8
4. **Add update**: 
   - Actual hours: 150
   - Percent complete: 25
   - Click "Save Update"
5. **Test email**: Click "Send Test Email"
   - Email appears in your terminal/console (not actually sent)

## 📋 What's Working

- ✅ Full app functionality
- ✅ Local SQLite database (no cloud needed)
- ✅ All calculations working
- ✅ Email preview in console
- ✅ Complete user experience

## 🌐 Production Setup (Later)

When you're ready to deploy:

1. **Create Supabase account**: https://supabase.com (2 min)
2. **Get Resend API key**: https://resend.com (1 min)
3. **Update `.env.local`**:
   ```env
   DATABASE_PROVIDER="postgresql"
   DATABASE_URL="your-supabase-url"
   RESEND_API_KEY="your-resend-key"
   ```
4. **Deploy to Vercel**: Push to GitHub, import in Vercel (5 min)

## 💡 Demo Mode Features

- **SQLite database**: Stored locally in `dev.db`
- **Console emails**: See email content in terminal
- **No external dependencies**: Everything works offline
- **Full functionality**: All features work exactly the same

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill the process on port 3000
npx kill-port 3000
npm run dev
```

### Database issues
```bash
# Reset database
rm prisma/dev.db
npx prisma migrate dev --name init
```

### Can't login after registration
- Make sure you registered first
- Check terminal for any errors
- Try deleting `dev.db` and running migration again

## 📊 Test the Variance Logic

Create a job with these updates to see different statuses:

**Job: "Test Electrical"** (500 hours estimated)

1. **GREEN Status**:
   - Actual: 125 hrs
   - Complete: 25%
   - Result: On track (0% variance)

2. **YELLOW Status**:
   - Actual: 140 hrs
   - Complete: 25%
   - Result: 6% over (monitor)

3. **RED Status**:
   - Actual: 180 hrs
   - Complete: 25%
   - Result: 19% over (action needed!)

## 🎯 Next Steps

1. ✅ **Run locally** (you just did this!)
2. Test all features
3. When satisfied, set up Supabase for production
4. Deploy to Vercel
5. Share with your team

---

**Total time to run**: 60 seconds
**External accounts needed**: Zero (for local testing)
**Features working**: 100%

🎉 You're ready to go!
