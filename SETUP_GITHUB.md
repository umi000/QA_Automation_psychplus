# GitHub Repository Setup Guide

## Steps to Upload to GitHub Repository: QA_Automation_psychplus

### Step 1: Create the GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Repository name: `QA_Automation_psychplus`
5. Description: `Hacker News Playwright Automation - Take-Home Assignment`
6. Choose **Public** or **Private** (your choice)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click **"Create repository"**

### Step 2: Push Your Code to GitHub

After creating the repository, run these commands in your terminal:

```bash
# Navigate to your project directory
cd "C:\Users\Lenovo\Downloads\Psychplus"

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: Hacker News Playwright Automation"

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/QA_Automation_psychplus.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/QA_Automation_psychplus.git
git branch -M main
git push -u origin main
```

### Step 3: Verify Upload

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/QA_Automation_psychplus`
2. Verify all files are present
3. Check that the CI workflow is visible in `.github/workflows/` folder

### Troubleshooting

#### If you get authentication errors:
- Use GitHub Personal Access Token instead of password
- Or set up SSH keys for easier authentication

#### If the remote already exists:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/QA_Automation_psychplus.git
```

#### To check your current remote:
```bash
git remote -v
```
