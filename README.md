# 🎬 Vercel Video API

Simple and reliable video generation API optimized for Vercel Pro, designed for creating 1+ hour videos with Suno audio support.

## 🚀 Features

- ✅ **Direct MP4 response** - No background jobs or status polling
- ✅ **Multiple audio support** - Concatenate multiple Suno audio files
- ✅ **1+ hour videos** - Generate long-form content for YouTube
- ✅ **Vercel Pro optimized** - Uses maximum available resources
- ✅ **Simple API** - Just POST and get your video back

## 📋 API Endpoints

### POST /api/video/generate
Generate a video with static image and audio track(s).

**Request Body:**
```json
{
  "audioUrls": ["https://your-suno-url-1.mp3", "https://your-suno-url-2.mp3"],
  "imageUrl": "https://your-image-url.jpg",
  "targetDuration": 3600
}
```

**Response:** Direct MP4 video file download

### GET /api/health
Check API health and status.

**Response:**
```json
{
  "status": "healthy",
  "service": "Vercel Video API",
  "version": "1.0.0",
  "features": [...],
  "endpoints": {...}
}
```

## 🔧 Deployment Instructions

### 1. GitHub Setup
1. Create new repository on GitHub
2. Upload all files from this project
3. Ensure folder structure is correct:
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
   └── README.md
   ```

### 2. Vercel Deployment
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login
3. Click "New Project"
4. Import your GitHub repository
5. **Important:** Upgrade to Vercel Pro for better performance
6. Deploy!

### 3. Vercel Pro Benefits
- **3GB memory** (vs 1GB on free tier)
- **5 minute timeout** (vs 10 seconds)
- **Better performance** for video processing

## 🎯 N8N Integration

### HTTP Request Node Configuration
- **URL:** `https://your-vercel-url.vercel.app/api/video/generate`
- **Method:** POST
- **Body Content Type:** JSON
- **Response:** File (Binary Property: `data`)

### JSON Body Example
```json
{
  "audioUrls": ["{{ $json.audioUrls }}"],
  "imageUrl": "{{ $('Generate an image').item.json.url }}",
  "targetDuration": 3600
}
```

### Response Handling
The API returns the MP4 file directly. No status polling needed!

## ⚡ Performance Tips

1. **Use Vercel Pro** - Essential for video processing
2. **Optimize audio files** - Smaller files process faster
3. **Test with short videos first** - Verify setup works
4. **Monitor timeout limits** - Very long videos may hit limits

## 🐛 Troubleshooting

### Common Issues
- **Timeout errors:** Upgrade to Vercel Pro
- **Memory errors:** Reduce video duration or audio file sizes
- **Download failures:** Check audio URL accessibility

### Debug Steps
1. Test health endpoint: `/api/health`
2. Check Vercel function logs
3. Verify audio URLs are accessible
4. Ensure image URL is valid

## 📊 Limits

- **Maximum duration:** ~2 hours (depends on complexity)
- **Audio file size:** ~100MB per file recommended
- **Total processing time:** 5 minutes (Vercel Pro limit)
- **Response size:** 50MB (Vercel limit)

## 🔒 Security

- No API keys required
- Temporary file cleanup
- No data persistence
- HTTPS only

## 📞 Support

For issues or questions:
1. Check Vercel function logs
2. Verify all URLs are accessible
3. Test with smaller files first
4. Ensure Vercel Pro is active

