import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import https from 'https';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  let tempDir;

  try {
    const { audioUrls, imageUrl, targetDuration = 120 } = req.body;

    // Validation
    if (!audioUrls || !Array.isArray(audioUrls) || audioUrls.length === 0) {
      return res.status(400).json({ error: 'audioUrls must be a non-empty array' });
    }

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    // Create temp directory
    const jobId = Date.now().toString();
    tempDir = `/tmp/video_${jobId}`;
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    console.log(`Starting video generation for job ${jobId}`);

    // Download image
    const imagePath = path.join(tempDir, 'image.jpg');
    console.log('Downloading image...');
    await downloadFile(imageUrl, imagePath);
    console.log('Image downloaded successfully');

    // Download audio files
    const audioFiles = [];
    for (let i = 0; i < audioUrls.length; i++) {
      console.log(`Downloading audio ${i + 1}/${audioUrls.length}...`);
      const audioPath = path.join(tempDir, `audio_${i}.mp3`);
      await downloadFile(audioUrls[i], audioPath);
      audioFiles.push(audioPath);
      console.log(`Audio ${i + 1} downloaded successfully`);
    }

    // Create concat file for multiple audio files
    let finalAudioPath;
    if (audioFiles.length === 1) {
      finalAudioPath = audioFiles[0];
    } else {
      console.log('Concatenating audio files...');
      const concatFile = path.join(tempDir, 'concat.txt');
      const concatContent = audioFiles.map(file => `file '${file}'`).join('\n');
      fs.writeFileSync(concatFile, concatContent);

      finalAudioPath = path.join(tempDir, 'combined_audio.mp3');
      await execAsync(`ffmpeg -f concat -safe 0 -i "${concatFile}" -c copy "${finalAudioPath}"`);
      console.log('Audio concatenation completed');
    }

    // Get audio duration
    console.log('Getting audio duration...');
    const { stdout: durationOutput } = await execAsync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${finalAudioPath}"`);
    const audioDuration = parseFloat(durationOutput.trim());
    console.log(`Audio duration: ${audioDuration} seconds`);
    
    // Use target duration or audio duration, whichever is appropriate
    const videoDuration = Math.max(targetDuration, audioDuration);
    console.log(`Video duration will be: ${videoDuration} seconds`);

    // Create video
    console.log('Creating video...');
    const outputPath = path.join(tempDir, 'output.mp4');
    
    const ffmpegCmd = [
      'ffmpeg',
      '-loop 1',
      `-i "${imagePath}"`,
      `-i "${finalAudioPath}"`,
      '-c:v libx264',
      '-preset ultrafast',
      '-tune stillimage',
      '-c:a aac',
      '-b:a 192k',
      '-pix_fmt yuv420p',
      '-shortest',
      `-t ${videoDuration}`,
      `"${outputPath}"`
    ].join(' ');

    console.log('Running FFmpeg command...');
    await execAsync(ffmpegCmd);

    // Check if video was created
    if (!fs.existsSync(outputPath)) {
      throw new Error('Video file was not created');
    }

    const stats = fs.statSync(outputPath);
    console.log(`Video created successfully: ${stats.size} bytes`);

    // Read video file
    const videoBuffer = fs.readFileSync(outputPath);
    
    // Cleanup
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('Cleanup completed');
    } catch (cleanupError) {
      console.warn('Cleanup warning:', cleanupError.message);
    }

    // Send video as response
    const processingTime = (Date.now() - startTime) / 1000;
    console.log(`Total processing time: ${processingTime} seconds`);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="video_${jobId}.mp4"`);
    res.setHeader('Content-Length', videoBuffer.length);
    res.setHeader('X-Processing-Time', processingTime.toString());
    res.setHeader('X-Video-Duration', videoDuration.toString());
    
    return res.send(videoBuffer);

  } catch (error) {
    console.error('Video generation error:', error);
    
    // Cleanup on error
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.warn('Error cleanup failed:', cleanupError.message);
      }
    }

    const processingTime = (Date.now() - startTime) / 1000;

    return res.status(500).json({ 
      error: 'Video generation failed', 
      details: error.message,
      processingTime: processingTime,
      timestamp: new Date().toISOString()
    });
  }
}

async function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    const request = https.get(url, {
      timeout: 60000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(filepath, () => {});
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (error) => {
        file.close();
        fs.unlink(filepath, () => {});
        reject(error);
      });
    });

    request.on('error', (error) => {
      file.close();
      fs.unlink(filepath, () => {});
      reject(error);
    });

    request.on('timeout', () => {
      request.destroy();
      file.close();
      fs.unlink(filepath, () => {});
      reject(new Error('Download timeout after 60 seconds'));
    });
  });
}

export const config = {
  api: {
    responseLimit: false,
  },
}

