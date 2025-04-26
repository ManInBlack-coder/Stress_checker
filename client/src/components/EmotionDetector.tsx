import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import EmotionChart from './EmotionChart';

interface EmotionHistory {
  timestamp: string;
  emotions: {
    [key: string]: number;
  };
}

const EmotionDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistory[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        setIsModelLoading(false);
        startVideo();
      } catch (err) {
        setError('Mudelite laadimine ebaõnnestus');
        console.error('Error loading models:', err);
      }
    };

    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Kaamera ligipääs ebaõnnestus');
      console.error('Error accessing webcam:', err);
    }
  };

  const handleVideoPlay = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detectEmotions = async () => {
      if (isModelLoading) return;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceExpressions(canvas, detections);

        // Save emotion data if face is detected
        if (detections.length > 0) {
          const emotions = detections[0].expressions;
          setEmotionHistory(prev => {
            const newHistory = [...prev, {
              timestamp: new Date().toISOString(),
              emotions: {
                rõõm: emotions.happy * 100,
                kurbus: emotions.sad * 100,
                viha: emotions.angry * 100,
                hirm: emotions.fearful * 100,
                üllatus: emotions.surprised * 100,
                vastikus: emotions.disgusted * 100
              }
            }];
            // Keep last 50 measurements
            return newHistory.slice(-50);
          });
        }
      }

      requestAnimationFrame(detectEmotions);
    };

    detectEmotions();
  };

  return (
    <div className="emotion-detector">
      {isModelLoading && <div>Mudelite laadimine...</div>}
      {error && <div className="error">{error}</div>}
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          onPlay={handleVideoPlay}
          style={{ width: '100%', maxWidth: '600px' }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 50,
            left: 350,
            width: '100%',
            maxWidth: '600px'
          }}
        />
      </div>
      <div className="chart-container" style={{ marginTop: '20px', width: '100%', maxWidth: '800px', margin: '20px auto' }}>
        {emotionHistory.length > 0 && <EmotionChart data={emotionHistory} />}
      </div>
    </div>
  );
};

export default EmotionDetector; 