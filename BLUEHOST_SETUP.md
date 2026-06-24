# 🚀 Bluehost Deployment Guide - Complete Setup

## Your Setup
- **Hosting**: Bluehost Linux Shared Hosting ✅
- **Domain**: Already on Bluehost ✅
- **Website**: React + Vite (builds to `dist/` folder)
- **Deployment**: GitHub Actions → FTP → Bluehost

---

## 📝 Step-by-Step Setup Instructions

### **Step 1: Get FTP Credentials from Bluehost cPanel**

**Location**: `yourdomain.com/cpanel`

1. Log in to **Bluehost cPanel**
2. Find **Files** section (or scroll down)
3. Click **FTP Accounts** (or **FTP Manager**)
4. If there's an existing FTP account, click it to view details
5. If not, click **+ Create FTP Account**

**Information you need to note:**

```
🔹 FTP Host (Server): 
   - Often shown as: ftp.yourdomain.com
   - Or: your IP address like 192.168.1.1
   - Check "Server:" field in cPanel

🔹 FTP Username: 
   - Often: username@yourdomain.com
   - Or just the username like "arun"

🔹 FTP Password: 
   - The password for your FTP account
   - If you forgot it, you can reset it in cPanel

🔹 Directory: 
   - Usually: /public_html/
   - Don't worry if it shows something else, /public_html/ is standard
```

**Example (fill with your actual values):**
```
FTP Server: ftp.example.com
Username: arun@example.com
Password: Abc123XYZ!
Directory: /public_html/
```

---

### **Step 2: Add GitHub Repository Secrets**

**Important**: These secrets encrypt your credentials so they're safe on GitHub.

1. Go to your GitHub repository: `https://github.com/arun-arudra/arun-aura-designs`
2. Click **Settings** (top right menu)
3. Left sidebar → Click **Secrets and variables**
4. Click **Actions**
5. Click green button **"New repository secret"**

**Add 3 Secrets** (one at a time):

#### Secret #1: FTP Server
- **Name**: `FTP_SERVER`
- **Value**: Your FTP host (example: `ftp.arundesigns.com`)
- Click **Add secret**

#### Secret #2: FTP Username  
- **Name**: `FTP_USERNAME`
- **Value**: Your FTP username (example: `arun@arundesigns.com`)
- Click **Add secret**

#### Secret #3: FTP Password
- **Name**: `FTP_PASSWORD`
- **Value**: Your FTP password
- Click **Add secret**

**Verify**: You should see 3 secrets listed after adding them.

---

### **Step 3: Check GitHub Workflow (Already Done ✅)**

I've already configured `.github/workflows/deploy.yml` to deploy to Bluehost using FTP.

**What it does:**
1. Triggers when you push to `main` or `master` branch
2. Installs dependencies (`npm install`)
3. Builds your React app (`npm run build`)
4. Uploads the `dist/` folder to Bluehost via FTP
5. Website updates automatically!

---

## 🧪 Step 4: Test the Deployment

### **Test #1: Make a Small Change and Push**

1. Open VS Code (your project folder)
2. Make a tiny change to a file (like edit `src/App.tsx`)
   ```tsx
   // Add a comment or change text
   // Example: change "Welcome" to "Welcome - Updated"
   ```
3. Save the file
4. In terminal (in your project folder):
   ```bash
   git add .
   git commit -m "test deployment"
   git push
   ```

5. Go to GitHub → **Actions** tab
6. Watch the workflow run (should take 2-3 minutes)
7. Check your Bluehost domain - you should see the change!

---

### **Test #2: Check GitHub Actions Logs**

If something goes wrong:

1. Go to GitHub repo → **Actions** tab
2. Click the failed workflow
3. Scroll down to see error messages
4. Common errors:
   - "Authentication failed" → Check FTP credentials
   - "Connection timeout" → Check FTP server address
   - "Directory not found" → Check server-dir path

---

## 🔧 Bluehost Specific Notes

### **1. Which branch to push to?**
- Workflow is set to deploy on `main` or `master` branch
- Push to whichever is your main branch
- Check your repo's default branch in GitHub Settings

### **2. Bluehost Directory Structure**
```
public_html/          ← Website root (this is what visitors see)
  ├── index.html      ← From your dist/ folder
  ├── assets/         ← CSS, JS from dist/
  └── images/         ← From dist/
```

The workflow uploads everything from your `dist/` folder to `/public_html/`

### **3. Build Output**
Your project builds with:
```bash
npm run build
```
Creates a `dist/` folder with:
- `index.html` - Main HTML file
- `assets/` - JavaScript and CSS bundles
- Other static files

This is exactly what Bluehost needs!

### **4. DNS and Domain**
Since your domain is already on Bluehost:
- DNS already points to Bluehost servers
- No additional DNS changes needed
- Website will update automatically when files are uploaded

---

## 📊 Workflow Summary

```
Your Local Computer
    ↓ (git push)
GitHub Repository  
    ↓ (workflow triggers)
GitHub Actions
    ├─ npm install
    ├─ npm run build
    └─ npm run test (optional)
    ↓ (FTP upload)
Bluehost FTP Server
    ↓ (files in public_html/)
Your Live Website
    ✅ yourdomain.com
```

---

## ✅ Deployment Checklist

- [ ] **Step 1**: Got FTP credentials from Bluehost cPanel
- [ ] **Step 2**: Added 3 GitHub secrets (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD)
- [ ] **Step 3**: Workflow file is configured (already done ✅)
- [ ] **Step 4**: Made test commit and pushed to GitHub
- [ ] **Step 5**: Watched GitHub Actions succeed
- [ ] **Step 6**: Checked your domain and saw the update

---

## 🚀 How to Deploy Going Forward

After setup is complete, deploying is **super easy**:

```bash
# Make changes locally
# Then:
git add .
git commit -m "your message"
git push

# That's it! Website updates automatically in 2-3 minutes
```

---

## 🆘 Troubleshooting

### **Problem**: Workflow fails with "Authentication failed"
**Solution**: 
- Double-check FTP credentials in Bluehost cPanel
- Make sure you copied the exact password
- Reset password in cPanel if unsure
- Update GitHub secrets with new credentials

### **Problem**: Website doesn't update after push
**Solution**:
- Check GitHub Actions tab for errors
- Check Bluehost cPanel - files might not be uploading
- Clear browser cache (Ctrl+Shift+Delete) and refresh
- Wait 2-3 minutes for workflow to complete

### **Problem**: "Connection refused" or "Connection timeout"
**Solution**:
- Verify FTP server address is correct
- Check if Bluehost has FTP enabled
- Try using cPanel FTP backup details

### **Problem**: 404 error on website
**Solution**:
- Check that files were uploaded to `/public_html/`
- Verify `index.html` exists in Bluehost
- Check file permissions (should be 644 for files, 755 for directories)

---

## 📞 Need Help?

If something doesn't work:
1. Check GitHub Actions logs (most details there)
2. Verify FTP credentials are exactly correct
3. Try manually uploading one file via FTP to test connectivity
4. Contact Bluehost support if FTP not working

**You're all set!** 🎉 Let me know when you've added the GitHub secrets and I can walk you through the first test deployment!
