# 📋 Step-by-Step Deployment Guide

## 🗂️ Step 1: Delete Old Repository (Optional)

If you want a fresh start:
1. Go to your GitHub repository
2. Settings → Scroll down → "Delete this repository"
3. Type repository name to confirm
4. Delete

## 📁 Step 2: Create New GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "New repository" (green button)
3. Repository name: `vercel-video-api`
4. Set to Public or Private (your choice)
5. **DO NOT** initialize with README
6. Click "Create repository"

## 📤 Step 3: Upload Files to GitHub

### Method 1: Drag & Drop (Easiest)
1. Download and extract the ZIP file
2. Go to your empty GitHub repository
3. Click "uploading an existing file"
4. Drag ALL files and folders from the extracted ZIP
5. Commit message: "Initial video API setup"
6. Click "Commit new files"

### Method 2: Individual Upload
1. Click "Add file" → "Create new file"
2. For each file, copy the path and content:

**File: `package.json`**
- Click "Add file" → "Create new file"
- Filename: `package.json`
- Copy content from the ZIP file
- Commit

**File: `pages/index.js`**
- Click "Add file" → "Create new file"  
- Filename: `pages/index.js`
- Copy content from the ZIP file
- Commit

**File: `pages/api/health.js`**
- Click "Add file" → "Create new file"
- Filename: `pages/api/health.js`
- Copy content from the ZIP file
- Commit

**File: `pages/api/video/generate.js`**
- Click "Add file" → "Create new file"
- Filename: `pages/api/video/generate.js`
- Copy content from the ZIP file
- Commit

**File: `public/.gitkeep`**
- Click "Add file" → "Create new file"
- Filename: `public/.gitkeep`
- Content: `# Keep this directory`
- Commit

## ✅ Step 4: Verify GitHub Structure

Your repository should look like this:
```
├── pages/
│   ├── index.js
│   └── api/
│       ├── health.js
│       └── video/
│           └── generate.js
├── public/
│   └── .gitkeep
├── package.json
├── .gitignore
├── README.md
└── DEPLOYMENT-GUIDE.md
```

## 🚀 Step 5: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Find your `vercel-video-api` repository
5. Click "Import"
6. **Framework Preset:** Next.js (auto-detected)
7. **Root Directory:** `./` (default)
8. Click "Deploy"
9. Wait 2-3 minutes for deployment

## 💳 Step 6: Upgrade to Vercel Pro

**IMPORTANT:** Free tier won't work for video processing!

1. Go to Vercel Dashboard
2. Settings → Billing
3. Upgrade to Pro ($20/month)
4. This gives you:
   - 3GB memory (vs 1GB)
   - 5 minute timeout (vs 10 seconds)
   - Better performance

## 🧪 Step 7: Test Your API

### Test Health Endpoint
1. Go to: `https://your-project-name.vercel.app/api/health`
2. You should see JSON response with "status": "healthy"

### Test Video Generation (Optional)
Use a tool like Postman or curl:
```bash
curl -X POST https://your-project-name.vercel.app/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{
    "audioUrls": ["https://your-test-audio.mp3"],
    "imageUrl": "https://your-test-image.jpg", 
    "targetDuration": 30
  }' \
  --output test-video.mp4
```

## 🔧 Step 8: Configure N8N

### HTTP Request Node
- **URL:** `https://your-project-name.vercel.app/api/video/generate`
- **Method:** POST
- **Body Content Type:** JSON
- **Response:** File
- **Binary Property:** `data`

### JSON Body
```json
{
  "audioUrls": ["{{ $json.audioUrls }}"],
  "imageUrl": "{{ $('Generate an image').item.json.url }}",
  "targetDuration": 3600
}
```

## 🎯 Step 9: First Real Test

1. Use your actual Suno URL
2. Use your actual OpenAI image URL
3. Start with short duration (120 seconds)
4. If successful, increase to 3600 seconds (1 hour)

## 🐛 Troubleshooting

### Deployment Fails
- Check all files are uploaded correctly
- Verify folder structure matches exactly
- Look at Vercel build logs for errors

### API Returns 500 Error
- Check Vercel function logs
- Verify Vercel Pro is active
- Test with smaller files first

### Timeout Errors
- Ensure Vercel Pro is active
- Reduce video duration for testing
- Check audio URLs are accessible

### N8N Integration Issues
- Verify API URL is correct
- Check JSON body syntax
- Set response type to "File"
- Use binary property "data"

## ✅ Success Checklist

- [ ] GitHub repository created
- [ ] All files uploaded correctly
- [ ] Vercel deployment successful
- [ ] Vercel Pro activated
- [ ] Health endpoint returns "healthy"
- [ ] N8N configured correctly
- [ ] Test video generated successfully

## 🎉 You're Done!

Your video API is now live and ready to generate 1+ hour videos with your Suno audio and OpenAI images!

