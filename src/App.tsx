import React, { useState, useEffect } from 'react';
import { Brain, Camera, Image, Video, Loader } from 'lucide-react';
import HeroBackground from './components/HeroBackground';
import ImageDetection from './components/ImageDetection';
import VideoDetection from './components/VideoDetection';
import RealTimeDetection from './components/RealTimeDetection';
import { loadModel } from './utils/modelLoader';

type TabType = 'image' | 'video' | 'realtime';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('image');
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState<string>('');

  useEffect(() => {
    const initializeModel = async () => {
      try {
        await loadModel();
        setIsModelLoading(false);
      } catch (error) {
        setModelError('Failed to load AI model. Please refresh the page.');
        setIsModelLoading(false);
        console.error('Model initialization error:', error);
      }
    };

    initializeModel();
  }, []);

  const tabs = [
    { id: 'image' as TabType, label: 'Image Detection', icon: Image },
    { id: 'video' as TabType, label: 'Video Detection', icon: Video },
    { id: 'realtime' as TabType, label: 'Real-Time', icon: Camera },
  ];

  if (isModelLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 bg-blue-100 rounded-full inline-block">
            <Brain className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
          <div className="text-gray-800">
            <h2 className="text-2xl font-bold mb-2">Loading AI Model</h2>
            <div className="flex items-center justify-center space-x-2">
              <Loader className="w-5 h-5 animate-spin text-blue-600" />
              <p>Initializing COCO-SSD object detection model...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (modelError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 p-8 bg-red-50 border border-red-200 rounded-2xl">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800">Model Loading Failed</h2>
          <p className="text-gray-600 max-w-md">{modelError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'image':
        return <ImageDetection />;
      case 'video':
        return <VideoDetection />;
      case 'realtime':
        return <RealTimeDetection />;
      default:
        return <ImageDetection />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <HeroBackground />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">AI Object Detection</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Powered by TensorFlow.js and COCO-SSD model. Detect and identify 80+ different object types 
            in images, videos, and real-time camera feeds.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 p-1 bg-gray-100 rounded-2xl max-w-2xl mx-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 flex-1 min-w-0 ${
                activeTab === id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium truncate">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {renderActiveTab()}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Built with TensorFlow.js • COCO-SSD Model • React • TypeScript
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;