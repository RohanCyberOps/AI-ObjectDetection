import React from 'react';
import { Detection } from '../types/detection';
import { createColorLegend } from '../utils/drawingUtils';
import { Clock, Target, Zap } from 'lucide-react';

interface DetectionResultsProps {
  detections: Detection[];
  processingTime: number;
  imageSize?: { width: number; height: number };
}

const DetectionResults: React.FC<DetectionResultsProps> = ({
  detections,
  processingTime,
  imageSize
}) => {
  const legend = createColorLegend(detections);
  const averageConfidence = detections.length > 0 
    ? detections.reduce((sum, det) => sum + det.score, 0) / detections.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Objects Found</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">{detections.length}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Avg. Confidence</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {Math.round(averageConfidence * 100)}%
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Processing Time</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-1">{processingTime}ms</p>
        </div>
      </div>

      {/* Legend */}
      {legend.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">Detected Objects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {legend.map(({ class: className, color, count }) => (
              <div key={className} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium capitalize">{className}</span>
                <span className="text-xs text-gray-500">({count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Results */}
      {detections.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">Detection Details</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {detections.map((detection, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: legend.find(l => l.class === detection.class)?.color }}
                  />
                  <span className="font-medium capitalize">{detection.class}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {Math.round(detection.score * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(detection.bbox[2])}×{Math.round(detection.bbox[3])}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectionResults;