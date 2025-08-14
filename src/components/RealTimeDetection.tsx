import React, { useState, useRef, useEffect } from 'react';
import { Camera, Square, Loader, AlertTriangle } from 'lucide-react';
import DetectionResults from './DetectionResults';
import { detectObjects } from '../utils/modelLoader';
import { drawBoundingBoxes } from '../utils/drawingUtils';
import { DetectionResult } from '../types/detection';

const RealTimeDetection: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [fps, setFps] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);

  const startCamera = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'environment'
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setIsActive(true);
            setIsLoading(false);
            startDetection();
          }
        };
      }
    } catch (err) {
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
      setIsLoading(false);
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsActive(false);
    setResult(null);
    setFps(0);
  };

  const startDetection = () => {
    const detectFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !isActive) return;
      
      const currentTime = performance.now();
      frameCount.current++;
      
      // Calculate FPS every second
      if (currentTime - lastFrameTime.current >= 1000) {
        setFps(Math.round(frameCount.current));
        frameCount.current = 0;
        lastFrameTime.current = currentTime;
      }

      try {
        const startTime = performance.now();
        const detections = await detectObjects(videoRef.current);
        const endTime = performance.now();
        
        const newResult: DetectionResult = {
          detections,
          processingTime: Math.round(endTime - startTime),
          imageSize: { 
            width: videoRef.current.videoWidth, 
            height: videoRef.current.videoHeight 
          }
        };
        
        setResult(newResult);
        
        // Update canvas size to match video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        drawBoundingBoxes(
          canvasRef.current, 
          detections, 
          videoRef.current.videoWidth, 
          videoRef.current.videoHeight
        );
      } catch (err) {
        console.error('Detection error:', err);
      }
      
      if (isActive) {
        animationRef.current = requestAnimationFrame(detectFrame);
      }
    };
    
    detectFrame();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      startDetection();
    }
  }, [isActive]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Detection</h2>
        <p className="text-gray-600">Use your camera to detect objects in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera View */}
        <div className="space-y-4">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            {!isActive && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startCamera}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <span>Start Camera</span>
                </button>
              </div>
            )}
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center space-x-3 text-white">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Starting camera...</span>
                </div>
              </div>
            )}
            
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
            
            {isActive && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                {fps} FPS
              </div>
            )}
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
          
          {isActive && (
            <button
              onClick={stopCamera}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <Square className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}
        </div>

        {/* Results */}
        <div>
          {result && (
            <DetectionResults
              detections={result.detections}
              processingTime={result.processingTime}
              imageSize={result.imageSize}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeDetection;