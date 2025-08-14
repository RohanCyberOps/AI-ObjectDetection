import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Loader } from 'lucide-react';
import FileUploader from './FileUploader';
import DetectionResults from './DetectionResults';
import { detectObjects } from '../utils/modelLoader';
import { drawBoundingBoxes } from '../utils/drawingUtils';
import { DetectionResult } from '../types/detection';

const ImageDetection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setResult(null);
    
    try {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setSelectedFile(file);
      
      // Wait for image to load
      const img = new Image();
      img.onload = async () => {
        const startTime = performance.now();
        const detections = await detectObjects(img);
        const endTime = performance.now();
        
        const newResult: DetectionResult = {
          detections,
          processingTime: Math.round(endTime - startTime),
          imageSize: { width: img.width, height: img.height }
        };
        
        setResult(newResult);
        
        // Draw bounding boxes
        if (canvasRef.current) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          drawBoundingBoxes(canvasRef.current, detections, img.width, img.height);
        }
        
        setIsProcessing(false);
      };
      
      img.src = url;
    } catch (error) {
      console.error('Error processing image:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Image Detection</h2>
        <p className="text-gray-600">Upload an image to detect and identify objects</p>
      </div>

      {!selectedFile && (
        <FileUploader
          onFileSelect={processImage}
          acceptedTypes="image/*"
          title="Upload Image"
          subtitle="Drag and drop an image or click to browse"
          icon={<ImageIcon className="w-8 h-8 text-blue-600" />}
        />
      )}

      {isProcessing && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mr-3" />
          <span className="text-lg text-gray-700">Processing image...</span>
        </div>
      )}

      {selectedFile && imageUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Display */}
          <div className="space-y-4">
            <div className="relative bg-white p-4 rounded-lg border">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Uploaded"
                className="w-full h-auto rounded"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-4 left-4 w-full h-auto rounded pointer-events-none"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>
            
            <button
              onClick={() => {
                setSelectedFile(null);
                setImageUrl('');
                setResult(null);
              }}
              className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Upload Another Image
            </button>
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

export default ImageDetection;