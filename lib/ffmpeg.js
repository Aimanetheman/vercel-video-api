import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function ensureFFmpeg() {
  // Check if ffmpeg is available
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return 'ffmpeg';
  } catch (error) {
    // FFmpeg not found, try alternative paths
    const possiblePaths = [
      '/usr/bin/ffmpeg',
      '/usr/local/bin/ffmpeg',
      '/opt/bin/ffmpeg'
    ];
    
    for (const ffmpegPath of possiblePaths) {
      try {
        execSync(`${ffmpegPath} -version`, { stdio: 'ignore' });
        return ffmpegPath;
      } catch (e) {
        continue;
      }
    }
    
    throw new Error('FFmpeg not available in this environment');
  }
}

export async function ensureFFprobe() {
  // Check if ffprobe is available
  try {
    execSync('ffprobe -version', { stdio: 'ignore' });
    return 'ffprobe';
  } catch (error) {
    // FFprobe not found, try alternative paths
    const possiblePaths = [
      '/usr/bin/ffprobe',
      '/usr/local/bin/ffprobe',
      '/opt/bin/ffprobe'
    ];
    
    for (const ffprobePath of possiblePaths) {
      try {
        execSync(`${ffprobePath} -version`, { stdio: 'ignore' });
        return ffprobePath;
      } catch (e) {
        continue;
      }
    }
    
    throw new Error('FFprobe not available in this environment');
  }
}
