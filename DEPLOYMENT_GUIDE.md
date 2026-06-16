# 🚀 Deployment Guide for Your React Project

## Quick Start: Choose Your Platform

### **RECOMMENDED: Vercel** ⭐
**Why?** Easiest setup, perfect for React/Vite, auto-deploys on every push

1. Go to https://vercel.com and sign up with GitHub
2. Click "New Project" → Import your repository
3. Vercel auto-detects Vite settings and deploys automatically
4. **Done!** Every push to main branch = live website

### **ALTERNATIVE: Netlify**
1. Go to https://netlify.com and sign up with GitHub
2. Click "Add new site" → Import existing project
3. Connect repository → Auto-deploy enabled
4. **Done!** Website is live

### **FREE: GitHub Pages**
1. Your site will be at: `https://username.github.io/arun-aura-designs`
2. In `.github/workflows/deploy.yml`, uncomment the GitHub Pages section
3. Go to repo Settings → Pages → Select `gh-pages` branch
4. Done! Website live at that URL

---

## 🔵 Setup for Bluehost (via GitHub Actions)

### Step 1: Get Bluehost FTP/SFTP Credentials
1. Log into Bluehost cPanel
2. Navigate to **Files → FTP Accounts** (or **Accounts → FTP Accounts**)
3. Create/View FTP credentials:
   - Server: `ftp.yourdomain.com` or your Bluehost IP
   - Username: Your FTP username
   - Password: Your FTP password
   - Directory: Usually `/public_html/`

### Step 2: Add Secrets to GitHub
1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Add these secrets:
   - `FTP_SERVER`: Your Bluehost FTP server
   - `FTP_USERNAME`: Your FTP username
   - `FTP_PASSWORD`: Your FTP password

### Step 3: Enable Bluehost Deployment in GitHub Actions
1. Open `.github/workflows/deploy.yml`
2. Find the "OPTION 5: Deploy to Bluehost" section
3. Uncomment those lines (remove the `#` characters)
4. Update `server-dir` to match your Bluehost path (usually `./public_html/`)

### Step 4: Test the Deployment
1. Make a small change to your code
2. Push to GitHub: `git push`
3. Go to Actions tab and watch the deployment
4. Check your Bluehost domain - it should be live!

---

## 📝 GitHub Secrets Setup (All Platforms)

### **For Vercel:**
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### **For Netlify:**
```
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

### **For Firebase:**
```
FIREBASE_SERVICE_ACCOUNT
```

### **For Bluehost/FTP:**
```
FTP_SERVER
FTP_USERNAME
FTP_PASSWORD
```

---

## 🔄 How It Works

1. **You make changes locally** → `git push` to GitHub
2. **GitHub Actions triggers** → Runs the workflow
3. **Build process** → `npm install` → `npm run build`
4. **Deploy** → Uploads `dist/` folder to your hosting
5. **Live!** → Website is updated automatically

---

## 💡 Recommended Path

**Best for beginners:**
1. Start with **Vercel** (5 minutes setup)
2. Later migrate to Bluehost if needed

**For Bluehost deployment:**
- Use the FTP Deploy action (Option 5)
- Or use SFTP if Bluehost supports it
- Test with small changes first

---

## ⚙️ Your Project Build Command

Your project uses:
```json
"build": "vite build"
```

Output: Creates `dist/` folder with production files

---

## 🆘 Troubleshooting

### Builds failing?
- Check Node version (use Node 18+)
- Run `npm install` locally to verify dependencies
- Check build logs in GitHub Actions tab

### Website not updating?
- Verify branch name (main vs master)
- Check GitHub Actions logs for errors
- Verify deployment credentials are correct

### Bluehost specific:
- Ensure FTP credentials are correct
- Check `public_html` permissions (should be 755)
- Clear browser cache or use incognito mode
- Check Bluehost staging vs production domain

---

## 📚 Next Steps

1. ✅ Choose a platform (recommend Vercel for now)
2. ✅ Sign up and connect GitHub repository
3. ✅ Add GitHub secrets (if needed)
4. ✅ Update `.github/workflows/deploy.yml` with your choice
5. ✅ Push to GitHub and watch it deploy!

Need help? Let me know which platform you choose!
