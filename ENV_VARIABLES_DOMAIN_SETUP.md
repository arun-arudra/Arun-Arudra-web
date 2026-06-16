# 🔧 Environment Variables & Domain Configuration Guide

## Part 1: GitHub Actions Environment Variables ✅

I've added environment variables to your workflow. Here's what was done:

### **What Are Environment Variables?**

Environment variables are configuration values used in your workflow:
- **Sensitive**: Passwords, tokens → Use `secrets` ✅ (already done)
- **Non-sensitive**: Paths, commands, versions → Use `env` variables ✅ (just added)

### **Current Environment Variables**

In `.github/workflows/deploy.yml`, I added:

```yaml
env:
  NODE_VERSION: '20'                              # Node.js version to use
  BUILD_COMMAND: 'npm run build'                  # Command to build
  DEPLOY_SOURCE: './dist/'                        # What to upload
  DEPLOY_DESTINATION: './public_html/ArunArudra/' # Where to upload
```

### **How to Modify Environment Variables**

1. Open `.github/workflows/deploy.yml` in VS Code
2. Edit the `env:` section at the top
3. Change any value you need:

```yaml
env:
  NODE_VERSION: '20'                    # Change Node version if needed
  BUILD_COMMAND: 'npm run build'        # Change build command if needed
  DEPLOY_SOURCE: './dist/'              # Don't change this
  DEPLOY_DESTINATION: './public_html/ArunArudra/'  # Update if path changes
```

4. Save and commit:
```bash
git add .
git commit -m "update environment variables"
git push
```

---

## Part 2: Point Domain to /public_html/ArunArudra 🌐

### **Why Change the Document Root?**

Currently: `yourdomain.com` → `/public_html/`  
You want: `yourdomain.com` → `/public_html/ArunArudra/`

This way, when someone visits your domain, they see your app.

### **Step-by-Step: Update Bluehost Domain Root**

#### **Option 1: Change Main Domain (Recommended if it's your primary)**

1. Go to **Bluehost cPanel** → `yourdomain.com/cpanel`
2. Find **Domains** or **Addon Domains**
3. Look for `arunarudra.com` (your main domain)
4. Click **Manage** button
5. Find **Document Root** field
6. Change from: `/public_html`
7. Change to: `/public_html/ArunArudra`
8. Click **Save**
9. **Important**: Create the `/public_html/ArunArudra` folder via FTP first!

#### **Option 2: If ArunArudra is a Subdomain**

1. Go to **cPanel → Addon Domains** or **Subdomains**
2. Find `arunarudra.com` or `www.arunarudra.com`
3. Click **Manage**
4. Update Document Root to `/public_html/ArunArudra`
5. Save

---

### **Step 1: Create the Directory Structure**

Before changing the domain root, ensure the directory exists on Bluehost.

**Option A: Via FTP (Recommended)**

1. Connect to Bluehost via FTP with your credentials
2. Navigate to `/public_html/`
3. Create a new folder: `ArunArudra`
4. Your structure should look like:
   ```
   public_html/
   ├── ArunArudra/        ← New folder
   │   ├── index.html     ← Will be deployed here
   │   ├── assets/
   │   └── ...
   └── other folders...
   ```

**Option B: Via cPanel File Manager**

1. Go to **cPanel → File Manager**
2. Navigate to `/public_html/`
3. Right-click → **Create Folder**
4. Name it: `ArunArudra`

---

### **Step 2: Update GitHub Workflow Destination**

The workflow is already set to deploy to `./public_html/ArunArudra/`

**Verify in `.github/workflows/deploy.yml`:**

```yaml
env:
  DEPLOY_DESTINATION: './public_html/ArunArudra/'  # ✅ Correct path
```

If you need to change it:
```yaml
env:
  DEPLOY_DESTINATION: './public_html/subfolder/'  # Your path here
```

---

### **Step 3: Update Bluehost Domain Root**

1. **Bluehost cPanel** → **Domains**
2. Find your domain `arunarudra.com`
3. Click **Manage**
4. Look for **Document Root** or **Public HTML**
5. Change value:
   - **From**: `/public_html`
   - **To**: `/public_html/ArunArudra`
6. **Save/Update**
7. **Wait 15-30 minutes** for changes to take effect

---

### **Step 4: Test the Deployment**

```bash
# Make a test change
echo "test" > src/test.txt

# Push to GitHub
git add .
git commit -m "test domain configuration"
git push
```

1. Watch GitHub Actions deploy
2. Wait 2-3 minutes for FTP upload
3. Visit `yourdomain.com` 
4. Website should be live! ✅

---

## 📊 Complete Workflow Summary

```
Your local machine
    ↓ git push
GitHub Repository
    ↓ workflow triggered
GitHub Actions
    ├─ env: NODE_VERSION = '20'
    ├─ env: BUILD_COMMAND = 'npm run build'
    ├─ env: DEPLOY_SOURCE = './dist/'
    ├─ env: DEPLOY_DESTINATION = './public_html/ArunArudra/'
    │
    ├─ Install dependencies
    ├─ Run build
    └─ Deploy to FTP
    ↓
Bluehost
    ├─ Files uploaded to: /public_html/ArunArudra/
    └─ Domain root points to: /public_html/ArunArudra/
    ↓
Live Website
    ✅ yourdomain.com → Shows your React app
```

---

## 📝 Common Environment Variables You Might Use

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_VERSION` | Node.js version | `'18'`, `'20'` |
| `BUILD_COMMAND` | Build script | `'npm run build'` |
| `DEPLOY_SOURCE` | Files to upload | `'./dist/'` |
| `DEPLOY_DESTINATION` | Target directory | `'./public_html/ArunArudra/'` |
| `FTP_TIMEOUT` | FTP connection timeout | `'30000'` |

---

## ✅ Checklist

- [ ] **Environment variables added** to workflow ✅ (done)
- [ ] **Created `/public_html/ArunArudra/` folder** in Bluehost
- [ ] **Updated Bluehost domain root** to `/public_html/ArunArudra/`
- [ ] **Verified GitHub secrets** are still in place
- [ ] **Made a test push** to GitHub
- [ ] **Watched workflow complete** in Actions tab
- [ ] **Visited domain** and saw website live

---

## 🆘 Troubleshooting

### **Problem**: Website shows 404 or default Bluehost page
**Solution**:
- Check that `/public_html/ArunArudra/` folder exists
- Verify domain root is set to `/public_html/ArunArudra/` (not `/public_html`)
- Wait 15-30 minutes for DNS propagation
- Clear browser cache (Ctrl+Shift+Delete)

### **Problem**: Files don't appear in `/public_html/ArunArudra/`
**Solution**:
- Check GitHub Actions logs for deployment errors
- Verify FTP credentials are correct
- Check Bluehost file permissions

### **Problem**: Build fails in GitHub Actions
**Solution**:
- Check Actions logs for error details
- Verify `npm run build` works locally:
  ```bash
  npm install
  npm run build
  ```

### **Problem**: Deployment completes but nothing changes
**Solution**:
- Verify files are uploading to correct directory
- Check if you need to clear Bluehost cache
- Verify domain root points to correct folder

---

## 📞 Key Information

**Your Setup:**
- Primary Domain: `arunarudra.com`
- Deploy to: `/public_html/ArunArudra/`
- Deploy from: GitHub Actions (on every push)
- File source: `./dist/` (built React app)

**Secrets (Already Added):**
- `FTP_SERVER` ✅
- `FTP_USERNAME` ✅
- `FTP_PASSWORD` ✅

**Environment Variables (Just Added):**
- `NODE_VERSION` = `'20'`
- `BUILD_COMMAND` = `'npm run build'`
- `DEPLOY_SOURCE` = `'./dist/'`
- `DEPLOY_DESTINATION` = `'./public_html/ArunArudra/'`

---

**You're all set!** 🚀 Let me know if you need help with any of these steps!
