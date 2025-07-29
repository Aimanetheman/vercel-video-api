import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  let ffmpeg;

  try {
    const { audioUrls, imageUrl, targetDuration = 120 } = req.body;

    // Validation
    if (!audioUrls || !Array.isArray(audioUrls) || audioUrls.length === 0) {
      return res.status(400).json({ error: 'audioUrls must be a non-empty array' });
    }

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    console.log('Initializing FFmpeg WebAssembly...');
    
    // Initialize FFmpeg
    ffmpeg = new FFmpeg();
    
    // Load FFmpeg WebAssembly
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    console.log('FFmpeg loaded successfully');

    // Download and write image file
    console.log('Downloading image...');
    const imageData = await fetchFile(imageUrl);
    await ffmpeg.writeFile('image.jpg', imageData);
    console.log('Image written to FFmpeg filesystem');

    // Download and write audio files
    const audioFiles = [];
    for (let i = 0; i < audioUrls.length; i++) {
      console.log(`Downloading audio ${i + 1}/${audioUrls.length}...`);
      const audioData = await fetchFile(audioUrls[i]);
      const audioFileName = `audio_${i}.mp3`;
      await ffmpeg.writeFile(audioFileName, audioData);
      audioFiles.push(audioFileName);
      console.log(`Audio ${i + 1} written to FFmpeg filesystem`);
    }

    // Create concat file for multiple audio files
    let finalAudioFile;
    if (audioFiles.length === 1) {
      finalAudioFile = audioFiles[0];
    } else {
      console.log('Creating concat file for multiple audio files...');
      const concatContent = audioFiles.map(file => `file '${file}'`).join('\n');
      await ffmpeg.writeFile('concat.txt', new TextEncoder().encode(concatContent));
      
      console.log('Concatenating audio files...');
      await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', 'concat.txt', '-c', 'copy', 'combined_audio.mp3']);
      finalAudioFile = 'combined_audio.mp3';
      console.log('Audio concatenation completed');
    }

    // Get audio duration
    console.log('Getting audio duration...');
    await ffmpeg.exec(['-i', finalAudioFile, '-f', 'null', '-']);
    
    // For simplicity, use targetDuration directly
    const videoDuration = targetDuration;
    console.log(`Video duration will be: ${videoDuration} seconds`);

    // Create video with static image and audio
    console.log('Creating video...');
    await ffmpeg.exec([
      '-loop', '1',
      '-i', 'image.jpg',
      '-i', finalAudioFile,
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-tune', 'stillimage',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      '-t', videoDuration.toString(),
      'output.mp4'
    ]);

    console.log('Video creation completed');

    // Read the output video
    const videoData = await ffmpeg.readFile('output.mp4');
    const videoBuffer = Buffer.from(videoData);

    console.log(`Video generated successfully: ${videoBuffer.length} bytes`);

    // Calculate processing time
    const processingTime = (Date.now() - startTime) / 1000;
    console.log(`Total processing time: ${processingTime} seconds`);

    // Send video as response
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="video_${Date.now()}.mp4"`);
    res.setHeader('Content-Length', videoBuffer.length.toString());
    res.setHeader('X-Processing-Time', processingTime.toString());
    res.setHeader('X-Video-Duration', videoDuration.toString());
    res.setHeader('X-FFmpeg-Type', 'WebAssembly');
    
    return res.send(videoBuffer);

  } catch (error) {
    console.error('Video generation error:', error);

    const processingTime = (Date.now() - startTime) / 1000;

    return res.status(500).json({ 
      error: 'Video generation failed', 
      details: error.message,
      processingTime: processingTime,
      timestamp: new Date().toISOString(),
      ffmpegType: 'WebAssembly'
    });
  }
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
  maxDuration: 300,
}

