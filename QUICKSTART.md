# 🚀 Quick Start Guide

Get your Birth Control Community platform up and running in 15 minutes!

## Step 1: Set Up Supabase (5 minutes)

1. **Create Account**: Go to [supabase.com](https://supabase.com) and sign up
2. **New Project**: Click "New Project"
   - Name: `birth-control-community`
   - Database Password: (create a strong password)
   - Region: Choose closest to you
   - Click "Create new project" (takes ~2 minutes)

3. **Get API Credentials**:
   - Go to Project Settings (gear icon) → API
   - Copy two values:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon public key**: Long string starting with `eyJ...`

4. **Set Up Database**:
   - Click "SQL Editor" in left sidebar
   - Click "New query"
   - Open `supabase-migration.sql` from this project
   - Copy entire file content
   - Paste into SQL Editor
   - Click "Run" button
   - You should see "Success. No rows returned"

## Step 2: Configure Your App (2 minutes)

1. Open `src/js/supabase-client.js`
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'https://xxxxx.supabase.co';  // Your URL here
   const SUPABASE_ANON_KEY = 'eyJxxxxx...';           // Your anon key here
   ```
3. Save the file

## Step 3: Test Locally (1 minute)

Open terminal in project folder and run:

```bash
# If you have Python:
python3 -m http.server 8000

# If you have Node:
npx serve .

# Or use VS Code Live Server extension
```

Visit `http://localhost:8000` in your browser!

## Step 4: Deploy to Netlify (5 minutes)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `.`
   - Click "Deploy site"

3. **Your site is live!** 🎉
   - Get your URL: `https://random-name-12345.netlify.app`
   - Test on mobile and desktop

## Step 5: First User Test (2 minutes)

1. Click "Sign Up" on your deployed site
2. Create an account with your email
3. Try the verification flow:
   - Click "Share" in bottom nav
   - Select a method and brand
   - Click "Get Verified Now"
   - Answer the questions
4. Create your first post!

## ✅ You're Done!

Your platform is now:
- ✅ Running on Supabase (backend)
- ✅ Deployed on Netlify (frontend)
- ✅ PWA-enabled (installable on mobile)
- ✅ Secure with authentication
- ✅ Ready for users!

## 🎯 Next Steps

**Optional Improvements**:
1. **Custom Domain**: Add your own domain in Netlify settings
2. **Email Verification**: Enable in Supabase Auth settings
3. **Social Login**: Add Google/GitHub login in Supabase Auth
4. **Analytics**: Add privacy-respecting analytics
5. **More Brands**: Add more pill brands to the database

**Add More Brands**:
```sql
-- Run in Supabase SQL Editor
INSERT INTO brands (id, method_id, name, manufacturer, type, generation, verification_questions) 
VALUES ('new-brand-id', 'pills', 'Brand Name', 'Manufacturer', 'combined', 'fourth',
  '[
    {"question": "Your question?", "options": ["A", "B", "C"], "correct": "A"}
  ]'::jsonb);
```

## 🆘 Troubleshooting

**"Failed to load posts"**
- Check Supabase URL and key in `supabase-client.js`
- Verify migration ran successfully in Supabase SQL Editor

**"User not found" on login**
- Check Supabase Auth settings
- Make sure email confirmation is disabled for testing

**Posts not showing**
- Run the seed data section of migration again
- Or create your first post manually!

**PWA not installing**
- HTTPS required (Netlify provides this automatically)
- Check manifest.json is accessible
- Test on actual mobile device, not just Chrome DevTools

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [PWA Checklist](https://web.dev/pwa-checklist/)

---

**Questions?** Check the main [README.md](README.md) or review the code - it's well-commented!
