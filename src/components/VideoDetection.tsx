import React, { useState, useRef } from 'react';
import { Video as VideoIcon, Loader, Play, Pause } from 'lucide-react';
import FileUploader from './FileUploader';
import DetectionResults from './DetectionResults';
import { detectObjects } from '../utils/modelLoader';
import { drawBoundingBoxes } from '../utils/drawingUtils';
import { DetectionResult } from '../types/detection';

const VideoDetection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const processVideo = async (file: File) => {
    setIsProcessing(true);
    setResult(null);
    
    try {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setSelectedFile(file);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
    }
  };

  const togglePlayback = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      videoRef.current.play();
      startDetection();
    }
    
    setIsPlaying(!isPlaying);
  };

  const startDetection = () => {
    const detectFrame = async () => {
      if (!videoRef.current || !canvasRef.current || videoRef.current.paused) {
        return;
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
      
      if (!videoRef.current?.paused) {
        animationRef.current = requestAnimationFrame(detectFrame);
      }
    };
    
    detectFrame();
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Detection</h2>
        <p className="text-gray-600">Upload a video to detect objects frame by frame</p>
      </div>

      {!selectedFile && (
        <FileUploader
          onFileSelect={processVideo}
          acceptedTypes="video/*"
          title="Upload Video"
          subtitle="Drag and drop a video or click to browse"
          icon={<VideoIcon className="w-8 h-8 text-blue-600" />}
        />
      )}

      {isProcessing && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mr-3" />
          <span className="text-lg text-gray-700">Processing video...</span>
        </div>
      )}

      {selectedFile && videoUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Display */}
          <div className="space-y-4">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-auto"
                onEnded={handleVideoEnded}
                controls={false}
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-auto pointer-events-none"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={togglePlayback}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Detection</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Detection</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setVideoUrl('');
                  setResult(null);
                  setIsPlaying(false);
                }}
                className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Upload Another
              </button>
            </div>
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
      )}
    </div>
  );
};

export default VideoDetection;