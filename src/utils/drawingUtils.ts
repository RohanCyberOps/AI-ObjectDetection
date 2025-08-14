import { Detection } from '../types/detection';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7', '#A29BFE'
];

export const drawBoundingBoxes = (
  canvas: HTMLCanvasElement,
  detections: Detection[],
  originalWidth: number,
  originalHeight: number
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scaleX = canvas.width / originalWidth;
  const scaleY = canvas.height / originalHeight;

  detections.forEach((detection, index) => {
    const [x, y, width, height] = detection.bbox;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;
    const scaledWidth = width * scaleX;
    const scaledHeight = height * scaleY;

    const color = COLORS[index % COLORS.length];
    
    // Draw bounding box
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
    
    // Draw label background
    const label = `${detection.class} (${Math.round(detection.score * 100)}%)`;
    ctx.font = '14px system-ui, -apple-system, sans-serif';
    const textWidth = ctx.measureText(label).width;
    const textHeight = 20;
    
    ctx.fillStyle = color;
    ctx.fillRect(scaledX, scaledY - textHeight, textWidth + 8, textHeight);
    
    // Draw label text
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    ctx.fillText(label, scaledX + 4, scaledY - textHeight + 2);
  });
};

export const createColorLegend = (detections: Detection[]): Array<{class: string, color: string, count: number}> => {
  const classCount: {[key: string]: number} = {};
  
  detections.forEach(detection => {
    classCount[detection.class] = (classCount[detection.class] || 0) + 1;
  });
  
  return Object.entries(classCount).map(([className, count], index) => ({
    class: className,
    color: COLORS[index % COLORS.length],
    count
  }));
};