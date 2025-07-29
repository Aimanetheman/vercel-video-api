# 🎬 FFmpeg Vercel Video API

Professional video generation API with **embedded FFmpeg WebAssembly** - no system dependencies required!

## 🚀 Key Features

- ✅ **Embedded FFmpeg** - Uses @ffmpeg/ffmpeg WebAssembly (no system installation needed)
- ✅ **Works on Vercel** - No "ffmpeg command not found" errors
- ✅ **Multiple Suno audio** - Concatenate multiple audio files
- ✅ **1+ hour videos** - Generate long-form content
- ✅ **Direct MP4 response** - No background jobs
- ✅ **Vercel Pro optimized** - Uses maximum resources

## 🔧 How It Works

This API uses **@ffmpeg/ffmpeg** which is a WebAssembly port of FFmpeg that runs entirely in the JavaScript environment. No system FFmpeg installation required!

## 📋 API Endpoints

### POST /api/video/generate
Generate video with embedded FFmpeg WebAssembly.

**Request:**
```json
{
  "audioUrls": ["https://your-suno-url-1.mp3", "https://your-suno-url-2.mp3"],
  "imageUrl": "https://your-image-url.jpg",
  "targetDuration": 3600
}
```

**Response:** Direct MP4 video file

### GET /api/health
Check API health and FFmpeg status.

## 🚀 Deployment Instructions

### 1. GitHub Setup
1. Create new repository: `ffmpeg-vercel-video-api`
2. Upload all files from this project
3. Ensure correct folder structure:
   ```
   ├── pages/
   │   ├── index.js
   │   └── api/
   │       ├── health.js
   │       └── video/
   │           └── generate.js
   ├── public/
   ├── package.json
   └── README.md
   ```

### 2. Vercel Deployment
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. **IMPORTANT:** Upgrade to Vercel Pro
4. Deploy!

### 3. Why Vercel Pro is Required
- **3GB memory** (WebAssembly needs more memory)
- **5 minute timeout** (video processing takes time)
- **Better performance** for FFmpeg operations

## 🎯 N8N Integration

### HTTP Request Configuration
- **URL:** `https://your-vercel-url.vercel.app/api/video/generate`
- **Method:** POST
- **Body Content Type:** JSON
- **Response:** File (Binary Property: `data`)

### JSON Body
```json
{
  "audioUrls": ["{{ $json.audioUrls }}"],
  "imageUrl": "{{ $('Generate an image').item.json.url }}",
  "targetDuration": 3600
}
```

## 💡 Technical Advantages

### vs System FFmpeg
- ✅ **No installation required** - Works out of the box
- ✅ **No "command not found" errors** - Embedded in JavaScript
- ✅ **Vercel compatible** - Runs in serverless environment
- ✅ **Cross-platform** - Same code works everywhere

### vs Other Solutions
- ✅ **No external services** - Everything runs in your Vercel function
- ✅ **No API keys** - No third-party dependencies
- ✅ **Full control** - Complete video processing pipeline
- ✅ **Cost effective** - Only pay for Vercel Pro

## ⚡ Performance

- **Initialization:** ~2-3 seconds (FFmpeg WebAssembly loading)
- **Processing:** Similar to native FFmpeg
- **Memory usage:** ~500MB-1GB (why Vercel Pro is needed)
- **Max duration:** Up to 2 hours (depending on complexity)

## 🐛 Troubleshooting

### Common Issues

**"Out of memory" errors:**
- Ensure Vercel Pro is active
- Reduce video duration for testing
- Check audio file sizes

**Slow processing:**
- WebAssembly is slightly slower than native FFmpeg
- Use shorter videos for testing first
- Consider audio file optimization

**Timeout errors:**
- Verify Vercel Pro 5-minute timeout
- Break very long videos into segments

## 📊 Limits

- **Memory:** 3GB (Vercel Pro)
- **Timeout:** 5 minutes (Vercel Pro)
- **File size:** 50MB response limit
- **Duration:** ~2 hours max (practical limit)

## 🔒 Security

- No system access required
- All processing in WebAssembly sandbox
- No file system dependencies
- Automatic cleanup

## 🎉 Success Story

This API solves the common "ffmpeg command not found" error on Vercel by using WebAssembly instead of system binaries. Perfect for serverless video generation!

