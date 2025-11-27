# Firebase Deployment Guide

A comprehensive guide to deploying Angular applications to Firebase Hosting.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Configuration](#configuration)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

### 2. Google Account
You need a Google account to access Firebase Console and create projects.

### 3. Node.js and npm
Ensure you have Node.js installed:
```bash
node --version
npm --version
```

---

## Initial Setup

### Step 1: Authenticate with Firebase

Login to Firebase using your Google account:
```bash
firebase login
```

This will:
- Open a browser window
- Ask you to sign in with your Google account
- Grant Firebase CLI access to your account

To check if you're logged in:
```bash
firebase login:list
```

### Step 2: Create a Firebase Project

**Option A: Using Firebase Console (Recommended for first time)**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "Employee Leave Management")
4. Accept terms and click "Continue"
5. Choose whether to enable Google Analytics (optional)
6. Click "Create project"

**Option B: Using Firebase CLI**
```bash
firebase projects:create your-project-id
```

### Step 3: List Your Projects
```bash
firebase projects:list
```

This shows all your Firebase projects with their IDs.

---

## Configuration

### Step 1: Create `firebase.json`

Create a file named `firebase.json` in your project root:

```json
{
  "hosting": {
    "public": "dist/elm/browser",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Configuration Explained:**
- `public`: The directory containing your built files (Angular's output directory)
- `ignore`: Files/folders Firebase should not upload
- `rewrites`: Routes all requests to `index.html` (required for Single Page Applications)

### Step 2: Create `.firebaserc`

Create a file named `.firebaserc` in your project root:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

Replace `your-project-id` with your actual Firebase project ID from Step 2.

**What this does:**
- Links your local project to your Firebase project
- Allows you to have multiple environments (staging, production)

### Step 3: Adjust Angular Build Budgets (If Needed)

If your app uses external libraries (Bootstrap, Material UI, etc.), you may need to increase build budgets.

Edit `angular.json`:

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "1MB",
    "maximumError": "2MB"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "10kB",
    "maximumError": "20kB"
  }
]
```

**Why?** Angular has default size limits to ensure good performance. Adjust these based on your app's needs.

---

## Building for Production

### Step 1: Clean Previous Builds (Optional but Recommended)
```bash
rm -rf dist
```

### Step 2: Build the Application
```bash
npm run build
```

Or explicitly:
```bash
ng build --configuration production
```

**What happens during build:**
- TypeScript is compiled to JavaScript
- Code is minified and optimized
- CSS is processed and minified
- Assets are copied to the output directory
- Source maps are generated (optional)

### Step 3: Verify Build Output

Check that the `dist` folder was created:
```bash
ls -la dist/elm/browser
```

You should see:
- `index.html`
- JavaScript bundles (`.js` files)
- CSS files (`.css` files)
- Assets folder

---

## Deployment

### Step 1: Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

**What this command does:**
1. Uploads all files from `dist/elm/browser` to Firebase
2. Configures hosting rules from `firebase.json`
3. Deploys to Firebase CDN
4. Provides you with a live URL

### Step 2: Monitor Deployment

You'll see output like:
```
✔  hosting[project-id]: file upload complete
i  hosting[project-id]: finalizing version...
✔  hosting[project-id]: version finalized
i  hosting[project-id]: releasing new version...
✔  hosting[project-id]: release complete

✔  Deploy complete!

Hosting URL: https://your-project-id.web.app
```

### Alternative: Deploy Everything
```bash
firebase deploy
```

This deploys all Firebase services (Hosting, Functions, Firestore, etc.)

---

## Post-Deployment

### 1. Test Your Deployment

Visit your hosting URL: `https://your-project-id.web.app`

**Test checklist:**
- [ ] Login page loads correctly
- [ ] Navigation works
- [ ] Direct URL access works (refresh on any route)
- [ ] Images and assets load
- [ ] API calls work (if applicable)
- [ ] Mobile responsiveness

### 2. View Deployment History

```bash
firebase hosting:channel:list
```

Or visit Firebase Console → Hosting → Release history

### 3. Set Up Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps
4. Wait for SSL certificate provisioning (automatic)

---

## Troubleshooting

### Issue 1: Build Errors - Budget Exceeded

**Error:**
```
✘ [ERROR] bundle initial exceeded maximum budget
```

**Solution:**
Increase budgets in `angular.json` (see Configuration Step 3)

### Issue 2: 404 on Page Refresh

**Problem:** Direct URLs or page refresh returns 404

**Solution:**
Ensure `firebase.json` has the rewrite rule:
```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

### Issue 3: Wrong Directory Deployed

**Error:** Blank page or "Firebase Hosting Setup Complete"

**Solution:**
Check `public` path in `firebase.json`. For Angular, it should be:
```json
"public": "dist/elm/browser"
```

### Issue 4: Not Logged In

**Error:**
```
Error: Not logged in
```

**Solution:**
```bash
firebase login
```

### Issue 5: Project Not Found

**Error:**
```
Error: Invalid project id
```

**Solution:**
1. Check `.firebaserc` has correct project ID
2. Verify project exists: `firebase projects:list`
3. Re-initialize: `firebase use your-project-id`

---

## Quick Reference Commands

```bash
# Authentication
firebase login                    # Login to Firebase
firebase logout                   # Logout
firebase login:list              # List logged in accounts

# Projects
firebase projects:list           # List all projects
firebase use project-id          # Switch to a project
firebase projects:create         # Create new project

# Build & Deploy
npm run build                    # Build Angular app
firebase deploy                  # Deploy everything
firebase deploy --only hosting   # Deploy only hosting

# Hosting Management
firebase hosting:channel:list    # List deployment channels
firebase hosting:channel:deploy  # Deploy to preview channel

# Logs
firebase hosting:channel:list    # View deployment history
```

---

## Continuous Deployment (Advanced)

### Using GitHub Actions

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

---

## Best Practices

1. **Always test locally before deploying**
   ```bash
   ng serve --configuration production
   ```

2. **Use environment files** for different configurations
   - `environment.ts` (development)
   - `environment.prod.ts` (production)

3. **Enable caching** in `firebase.json`:
   ```json
   "headers": [
     {
       "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
       "headers": [
         {
           "key": "Cache-Control",
           "value": "max-age=31536000"
         }
       ]
     }
   ]
   ```

4. **Monitor performance** in Firebase Console → Performance

5. **Set up alerts** for downtime or errors

6. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

---

## Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firebase Console](https://console.firebase.google.com/)

---

## Summary

**Complete deployment workflow:**

```bash
# 1. One-time setup
firebase login
# Create project in Firebase Console

# 2. Configure project (one-time)
# Create firebase.json and .firebaserc

# 3. Every deployment
npm run build
firebase deploy --only hosting

# 4. Verify
# Visit your hosting URL and test
```

**Your deployed app:** https://employee-leave-managemen-6f580.web.app

---

*Last updated: November 27, 2025*
