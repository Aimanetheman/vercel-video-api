export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎬 FFmpeg Vercel Video API</h1>
      <p>Professional video generation API with embedded FFmpeg for 1+ hour videos</p>
      
      <h2>📋 API Endpoints</h2>
      <ul>
        <li><strong>POST /api/video/generate</strong> - Generate video with embedded FFmpeg</li>
        <li><strong>GET /api/health</strong> - Health check</li>
      </ul>

      <h2>🔧 Example Request</h2>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
{`POST /api/video/generate
Content-Type: application/json

{
  "audioUrls": ["https://your-suno-url.mp3"],
  "imageUrl": "https://your-image-url.jpg",
  "targetDuration": 3600
}`}
      </pre>

      <h2>✅ Features</h2>
      <ul>
        <li>🎯 Embedded FFmpeg binary (no system dependencies)</li>
        <li>🎵 Multiple Suno audio file support</li>
        <li>⏱️ Up to 1+ hour video generation</li>
        <li>🚀 Optimized for Vercel Pro</li>
        <li>📱 Direct MP4 response</li>
      </ul>

      <h2>🔧 Technical Details</h2>
      <ul>
        <li>Uses @ffmpeg/ffmpeg WebAssembly</li>
        <li>No system FFmpeg installation required</li>
        <li>Works in Vercel serverless environment</li>
        <li>Automatic cleanup and error handling</li>
      </ul>
    </div>
  );
}

