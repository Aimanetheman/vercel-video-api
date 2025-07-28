export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎬 Vercel Video API</h1>
      <p>Simple video generation API for 1+ hour videos with Suno audio support</p>
      
      <h2>📋 API Endpoints</h2>
      <ul>
        <li><strong>POST /api/video/generate</strong> - Generate video</li>
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
        <li>Direct MP4 response (no background jobs)</li>
        <li>Multiple audio file support</li>
        <li>Up to 1+ hour video generation</li>
        <li>Optimized for Vercel Pro</li>
      </ul>
    </div>
  );
}

