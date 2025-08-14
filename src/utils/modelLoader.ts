import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

let model: cocoSsd.ObjectDetection | null = null;

export const loadModel = async (): Promise<cocoSsd.ObjectDetection> => {
  if (model) {
    return model;
  }
  
  try {
    console.log('Loading COCO-SSD model...');
    model = await cocoSsd.load();
    console.log('Model loaded successfully!');
    return model;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw new Error('Failed to load the object detection model');
  }
};

export const detectObjects = async (
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<Detection[]> => {
  const loadedModel = await loadModel();
  const predictions = await loadedModel.detect(imageElement);
  
  return predictions.map(prediction => ({
    bbox: prediction.bbox as [number, number, number, number],
    class: prediction.class,
    score: prediction.score
  }));
};