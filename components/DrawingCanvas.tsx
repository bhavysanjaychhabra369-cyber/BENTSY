
import React, { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
  width: number;
  height: number;
  brushColor: string;
  brushSize: number;
  isErasing: boolean;
  isVisible: boolean;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ width, height, brushColor, brushSize, isErasing, isVisible }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        setContext(ctx);
      }
    }
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = brushColor;
      context.lineWidth = brushSize;
      context.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    }
  }, [brushColor, brushSize, isErasing, context]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context) return;
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
        const rect = canvasRef.current!.getBoundingClientRect();
        return { 
            offsetX: e.touches[0].clientX - rect.left, 
            offsetY: e.touches[0].clientY - rect.top 
        };
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
  };

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 z-20"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
};

export default DrawingCanvas;
