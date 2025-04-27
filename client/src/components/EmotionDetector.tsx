import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import EmotionChart from './EmotionChart';
import { CameraIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';

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
        const MODEL_URL = `/Stress_checker/models`;
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
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

    // Set fixed dimensions for better control
    const videoWidth = 640;
    const videoHeight = 480;
    
    canvas.width = videoWidth;
    canvas.height = videoHeight;

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
                neutraalne: emotions.neutral * 100,
                rõõm: emotions.happy * 100,
                kurbus: emotions.sad * 100,
                viha: emotions.angry * 100,
                hirm: emotions.fearful * 100,
                üllatus: emotions.surprised * 100,
                vastikus: emotions.disgusted * 100
              }
            }];
            return newHistory.slice(-50);
          });
        }
      }

      requestAnimationFrame(detectEmotions);
    };

    detectEmotions();
  };

  return (
    <div className="emotion-detector space-y-8">
      {isModelLoading && (
        <div className="flex items-center justify-center p-6 bg-blue-50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
          <p className="text-indigo-600 font-medium">Mudelite laadimine...</p>
        </div>
      )}
      
      {error && (
        <div className="flex items-center p-4 bg-red-50 rounded-lg">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-xl">
            <div className="relative" style={{ paddingTop: '75%' }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                onPlay={handleVideoPlay}
                className="absolute top-0 left-0 w-full h-full object-contain"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
            
            <div className="absolute bottom-4 left-4 flex items-center bg-black/50 rounded-full px-4 py-2">
              <CameraIcon className="h-5 w-5 text-white mr-2" />
              <span className="text-white text-sm font-medium">Reaalajas analüüs</span>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3">
          {emotionHistory.length > 0 && <EmotionChart data={emotionHistory} />}
        </div>
      </div>
    </div>
  );
};

export default EmotionDetector; 