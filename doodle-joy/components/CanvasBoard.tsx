import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { ShapeConfig, ToolType, Point } from '../types';

interface CanvasBoardProps {
  shape: ShapeConfig;
  tool: ToolType;
  brushColor: string;
  brushSize: number;
  width: number;
  height: number;
  onInteract: () => void;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
  className?: string;
}

export interface CanvasBoardHandle {
  clearCanvas: () => void;
  resetCanvas: () => void;
  getCompositeImage: () => Promise<string>;
  undo: () => void;
  redo: () => void;
}

const CanvasBoard = forwardRef<CanvasBoardHandle, CanvasBoardProps>(({
  shape,
  tool,
  brushColor,
  brushSize,
  width,
  height,
  onInteract,
  onHistoryChange,
  className = ''
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<Point | null>(null);

  // History State
  const historyRef = useRef<ImageData[]>([]);
  const stepRef = useRef<number>(-1);

  const notifyHistoryChange = () => {
    if (onHistoryChange) {
      const canUndo = stepRef.current > 0;
      const canRedo = stepRef.current < historyRef.current.length - 1;
      onHistoryChange(canUndo, canRedo);
    }
  };

  const saveState = (ctx: CanvasRenderingContext2D) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const newHistory = historyRef.current.slice(0, stepRef.current + 1);
    newHistory.push(imageData);
    
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    historyRef.current = newHistory;
    stepRef.current = newHistory.length - 1;
    notifyHistoryChange();
  };

  const loadState = (index: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && historyRef.current[index]) {
      ctx.putImageData(historyRef.current[index], 0, 0);
      stepRef.current = index;
      notifyHistoryChange();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx && historyRef.current.length === 0) {
        const initialState = ctx.getImageData(0, 0, width, height);
        historyRef.current = [initialState];
        stepRef.current = 0;
        notifyHistoryChange();
      }
    }
  }, [width, height]);

  useImperativeHandle(ref, () => ({
    clearCanvas: () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, width, height);
            saveState(ctx);
            onInteract();
        }
      }
    },
    resetCanvas: () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, width, height);
            const initialState = ctx.getImageData(0, 0, width, height);
            historyRef.current = [initialState];
            stepRef.current = 0;
            notifyHistoryChange();
        }
      }
    },
    getCompositeImage: async () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return "";

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((shape.rotation * Math.PI) / 180);
      ctx.scale(shape.scaleX, shape.scaleY);
      ctx.translate(-width / 2, -height / 2);

      const p = new Path2D(shape.path);
      ctx.fillStyle = shape.color;
      ctx.fill(p);
      ctx.restore();

      if (canvasRef.current) {
        ctx.drawImage(canvasRef.current, 0, 0);
      }

      return tempCanvas.toDataURL('image/png');
    },
    undo: () => {
      if (stepRef.current > 0) {
        loadState(stepRef.current - 1);
        onInteract();
      }
    },
    redo: () => {
      if (stepRef.current < historyRef.current.length - 1) {
        loadState(stepRef.current + 1);
        onInteract();
      }
    }
  }));

  const getPos = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    // IMPORTANT: Because we use CSS scaling on the parent, 
    // getBoundingClientRect handles the coordinate mapping correctly.
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Map screen coordinates to canvas logical coordinates (width/height)
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    lastPos.current = getPos(e);
    onInteract();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPos.current || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Prevent scrolling on touch devices while drawing
    // Note: 'touch-action: none' in CSS handles most of this, 
    // but explicit prevention can be safer for older browsers if needed.
    // e.preventDefault(); 

    const currentPos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (tool === ToolType.ERASER) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
    }
    
    ctx.stroke();
    lastPos.current = currentPos;
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPos.current = null;
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) saveState(ctx);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-white ${className}`} style={{ width, height }}>
      {/* Underlying Shape Layer */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-500 ease-in-out"
        style={{
          transform: `rotate(${shape.rotation}deg) scale(${shape.scaleX}, ${shape.scaleY})`
        }}
      >
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <path d={shape.path} fill={shape.color} />
        </svg>
      </div>

      {/* Drawing Layer */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
});

CanvasBoard.displayName = 'CanvasBoard';

export default CanvasBoard;