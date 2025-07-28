export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    return res.status(200).json({
      status: 'healthy',
      service: 'Vercel Video API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: {
        platform: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      },
      features: [
        'Direct video response',
        'Multiple audio file concatenation', 
        'Up to 1+ hour video generation',
        'Optimized for Vercel Pro'
      ],
      endpoints: {
        generate: '/api/video/generate',
        health: '/api/health'
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

