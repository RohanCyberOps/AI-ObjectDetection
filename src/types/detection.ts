export interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export interface DetectionResult {
  detections: Detection[];
  processingTime: number;
  imageSize: {
    width: number;
    height: number;
  };
}