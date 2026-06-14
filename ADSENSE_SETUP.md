# 🎯 Google AdSense Setup Guide

## Overview
Your project is configured to display Google AdSense ads using the `SponsorSlot` component. This guide shows exactly where to add your AdSense credentials.

---

## ✅ What I've Already Done

I've added the AdSense configuration section to your `.env` file at the project root:

```env
# Google AdSense Configuration
VITE_SPONSOR_ENABLED="true"
VITE_ADSENSE_CLIENT="ca-pub-XXXXXXXXXXXXXXXX"
VITE_ADSENSE_SLOT="1234567890"
```

---

## 📝 Step 1: Get Your AdSense IDs

### **Get Your Publisher ID (VITE_ADSENSE_CLIENT)**

1. Go to **Google AdSense** → `adsense.google.com`
2. Sign in or create an account
3. Click **Account** (top right or left sidebar)
4. Look for **Publisher ID** (or **Account ID**)
5. It will look like: **`ca-pub-1234567890123456`**
6. Copy this value

### **Get Your Ad Unit Slot ID (VITE_ADSENSE_SLOT)**

1. In AdSense, go to **Ads** → **By ad unit** (left sidebar)
2. Create a new ad unit or find an existing one:
   - Click **New ad unit**
   - Choose ad format (e.g., "Display ads")
   - Name it (e.g., "News Article Ad")
   - Click **Create**
3. After creation, you'll see **Ad unit code** section
4. Look for the **Slot ID** in the code (10-digit number)
   - Example: `1234567890`
5. Copy this value

---

## 🔧 Step 2: Update `.env` File

### **Location**: Project root `→ .env`

**Current state** (already updated ✅):
```env
VITE_SUPABASE_PROJECT_ID="iqbehfwwdbdpxkiqmzsm"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://iqbehfwwdbdpxkiqmzsm.supabase.co"

# Google AdSense Configuration
VITE_SPONSOR_ENABLED="true"
VITE_ADSENSE_CLIENT="ca-pub-XXXXXXXXXXXXXXXX"      ← Replace this
VITE_ADSENSE_SLOT="1234567890"                    ← Replace this
```

### **Replace the values:**

1. Open `.env` in VS Code
2. Replace `ca-pub-XXXXXXXXXXXXXXXX` with your actual **Publisher ID**
   - Example: `ca-pub-1234567890123456`
3. Replace `1234567890` with your actual **Ad Unit Slot ID**
   - Example: `9876543210`

**Example (with real values):**
```env
VITE_SPONSOR_ENABLED="true"
VITE_ADSENSE_CLIENT="ca-pub-1234567890123456"
VITE_ADSENSE_SLOT="9876543210"
```

---

## 🌐 Step 3: Add `ads.txt` (Important for AdSense Approval)

Google AdSense requires an `ads.txt` file at your domain root for full approval.

### **Create `public/ads.txt`**

1. Go to folder: `public/`
2. Create new file: `ads.txt`
3. When AdSense approves your site, they'll give you one line to add
4. Paste that line into the file

**Example (you'll get this from AdSense):**
```
google.com, ca-pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

**Location in your project:**
```
public/
├── robots.txt
├── images/
├── ads.txt          ← Add this file here
```

---

## 🚀 Step 4: Restart Development Server

After updating `.env`:

```bash
# Stop the dev server (Ctrl+C)
# Then restart:
npm run dev
```

The dev server reads `.env` on startup, so you must restart for changes to take effect.

---

## 📍 Where Ads Will Appear

The `SponsorSlot` component is already placed in:

1. **News List** - Before the articles list
2. **Article Detail** - Inside the article body

If ads are enabled, they'll appear in these locations automatically.

---

## 🎛️ Environment Variable Meanings

| Variable | Meaning | Example |
|----------|---------|---------|
| `VITE_SPONSOR_ENABLED` | Turn ads on/off | `"true"` or `"false"` |
| `VITE_ADSENSE_CLIENT` | Your Publisher ID | `"ca-pub-1234567890123456"` |
| `VITE_ADSENSE_SLOT` | Default ad unit slot | `"9876543210"` |

---

## 🔄 Per-Placement Override (Optional)

If you want **different ad slots** in different locations:

1. In `src/pages/News.tsx` - Use slot for news list:
   ```tsx
   <SponsorSlot slotId="1111111111" />
   ```

2. In `src/pages/ArticleDetail.tsx` - Use slot for articles:
   ```tsx
   <SponsorSlot slotId="2222222222" />
   ```

This lets you track performance separately for different placements.

---

## ✅ Testing & Verification

### **Step 1: Verify Environment Variables Are Loaded**

1. Open your dev server console (browser F12)
2. Check that no errors about missing ads appear
3. You should see a styled ad placeholder or actual ad

### **Step 2: Check if Ads Are Loading**

- If `VITE_SPONSOR_ENABLED="false"` → No ads shown
- If credentials are missing → Gray placeholder shown (preview mode)
- If credentials are valid → Real AdSense ads shown

### **Step 3: Test Before Going Live**

- Test locally with `npm run dev`
- Make sure no console errors
- When deploying to Bluehost, ads will work once the site is approved

---

## 📋 Checklist

- [ ] **Step 1**: Got Publisher ID from AdSense Account
- [ ] **Step 2**: Got Ad Unit Slot ID from AdSense Ads section
- [ ] **Step 3**: Updated `.env` with your IDs
  - [ ] `VITE_ADSENSE_CLIENT` = ca-pub-...
  - [ ] `VITE_ADSENSE_SLOT` = 10-digit number
- [ ] **Step 4**: Created `public/ads.txt` (placeholder or actual)
- [ ] **Step 5**: Restarted dev server (`npm run dev`)
- [ ] **Step 6**: Verified ads or placeholders appear on News page
- [ ] **Step 7**: Will add actual ads.txt content after AdSense approval

---

## 🆘 Troubleshooting

### **Problem**: Ads not showing
**Solution**:
- Check `.env` file for typos in Publisher ID or Slot ID
- Restart dev server after changing `.env`
- Check browser console (F12) for errors
- Verify `VITE_SPONSOR_ENABLED="true"`

### **Problem**: "Invalid Publisher ID"
**Solution**:
- Make sure you copied from AdSense Account page (not ad unit page)
- Format should start with `ca-pub-`
- No extra spaces before/after

### **Problem**: Gray placeholder showing but no real ads
**Solution**:
- This is normal! Google needs to approve your site first
- Can take 24-48 hours after adding ads.txt
- Placeholder shows where ad will appear

### **Problem**: Environment variables not updating
**Solution**:
- You must **restart the dev server** after changing `.env`
- Kill the server with Ctrl+C
- Run `npm run dev` again

---

## 📞 What's Next?

1. ✅ **Add your AdSense IDs** to `.env` (just 2 values)
2. ✅ **Restart dev server** (`npm run dev`)
3. ✅ **Test on News page** - You should see ad placeholder or real ads
4. 🔄 **Create `public/ads.txt`** - Add content after AdSense approves
5. 🚀 **Deploy to Bluehost** - Ads will work automatically

---

## 🔗 Useful Links

- **Google AdSense**: https://adsense.google.com
- **AdSense Account Info**: https://adsense.google.com/u/0/account
- **Create Ad Unit**: https://adsense.google.com/u/0/account/site-admissions
- **Vite Environment Variables**: https://vitejs.dev/guide/env-and-mode

---

**You're all set!** 🎉 Just add your AdSense IDs to `.env`, restart the server, and ads will start appearing!
