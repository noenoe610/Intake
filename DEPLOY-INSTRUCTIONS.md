# Intake - FIXED VERSION FOR NETLIFY

This version loads Supabase from CDN to avoid module import errors.

## 🔧 What to Do:

### 1. Add Your Supabase Credentials

Open `src/js/supabase-client.js` and replace:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

With your actual credentials from Supabase.

### 2. Push to GitHub

```bash
cd intake-fixed
git init
git add .
git commit -m "Fixed Supabase loading"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/intake.git
git push -f origin main
```

(Use `-f` to force push and replace the broken version)

### 3. Netlify Will Auto-Deploy

Wait 1-2 minutes and your site should work!

## ✅ This Should Fix:

- ❌ "Unexpected token ':'" error
- ❌ Infinite loading spinner  
- ✅ App loads properly
- ✅ Supabase works

## 🎯 Changes Made:

1. Added Supabase CDN script to `index.html`
2. Updated `supabase-client.js` to use `window.supabase` from CDN
3. No more ES module import issues!
