'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [url, setUrl] = useState('');

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const processImage = async () => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      alert('Invalid YouTube URL');
      return;
    }

    const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 3000;
      canvas.height = 3000;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate dimensions to maintain aspect ratio
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `thumbnail-${videoId}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };

    img.src = thumbUrl;
  };

  return (
    <main className={styles.main}>
      <h1>YouTube Thumbnail Stretcher</h1>
      <div className={styles.container}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className={styles.input}
        />
        <button onClick={processImage} className={styles.button}>
          Process & Download
        </button>
      </div>
    </main>
  );
}
