import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ColoringPage } from '../types';
import { PALETTE_COLORS } from '../constants';
import { floodFill } from '../utils/floodFill';
import { Home, Eraser, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface CanvasEditorProps {
  page: ColoringPage;
  onBack: () => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ page, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE_COLORS[2]); 
  const [isReady, setIsReady] = useState(false);

  // Transform state
  const transform = useRef({ k: 1, x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const initialPinchDistance = useRef<number | null>(null);
  const initialScale = useRef<number>(1);
  const isPinching = useRef(false);
  const hasMoved = useRef(false);

  const updateTransform = () => {
    if (canvasRef.current) {
      const { x, y, k } = transform.current;
      canvasRef.current.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
      canvasRef.current.style.transformOrigin = '0 0';
    }
  };

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.src = page.imageSrc;
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      // High resolution internal canvas
      const internalWidth = 1024; 
      const internalHeight = 1024;
      
      canvas.width = internalWidth;
      canvas.height = internalHeight;

      // IMPORTANT: Fill background with WHITE first.
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate scale to fit image
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.85;
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      // Reset transform
      transform.current = { k: 1, x: 0, y: 0 };
      updateTransform();
      
      setIsReady(true);
    };
  }, [page]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Handle Fill Logic (separated from event handler for reuse)
  const performFill = (clientX: number, clientY: number) => {
    if (!isReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    // Account for CSS transform (zoom and pan)
    // First, get the position relative to the canvas element
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;
    
    // Reverse the transform to get the actual canvas coordinates
    // Transform: translate(x, y) scale(k)
    // To reverse: (relativeX - x) / k, (relativeY - y) / k
    const { x: tx, y: ty, k: scale } = transform.current;
    const canvasX = (relativeX - tx) / scale;
    const canvasY = (relativeY - ty) / scale;
    
    // Convert to internal canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor(canvasX * scaleX);
    const y = Math.floor(canvasY * scaleY);

    // Boundary check
    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
      floodFill(ctx, x, y, selectedColor);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Only handle click if it wasn't a drag/pinch operation
    // This is mainly for mouse users. Touch users are handled in onTouchEnd
    performFill(e.clientX, e.clientY);
  };

  // --- Touch Handlers for Zoom/Pan ---

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behaviors
    hasMoved.current = false;
    if (e.touches.length === 1) {
      isDragging.current = true;
      isPinching.current = false;
      lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      isPinching.current = true;
      isDragging.current = false;
      
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistance.current = dist;
      initialScale.current = transform.current.k;
      
      // Calculate center point for zoom
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      lastPosition.current = { x: centerX, y: centerY };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling the page
    hasMoved.current = true;

    if (isDragging.current && e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastPosition.current.x;
      const dy = e.touches[0].clientY - lastPosition.current.y;
      
      transform.current.x += dx;
      transform.current.y += dy;
      
      lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      updateTransform();
    } else if (isPinching.current && e.touches.length === 2 && initialPinchDistance.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const scaleFactor = dist / initialPinchDistance.current;
      // Limit zoom levels
      const newScale = Math.min(Math.max(initialScale.current * scaleFactor, 0.5), 5);
      
      // Zoom towards the center of the pinch
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;
        
        // Adjust translation to zoom towards pinch center
        const scaleChange = newScale / transform.current.k;
        transform.current.x = centerX - (centerX - transform.current.x) * scaleChange;
        transform.current.y = centerY - (centerY - transform.current.y) * scaleChange;
      }
      
      transform.current.k = newScale;
      updateTransform();
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    
    // If we were pinching and now have less than 2 touches, stop pinching
    if (e.touches.length < 2) {
      isPinching.current = false;
      initialPinchDistance.current = null;
    }
    
    // If we have no touches left, stop dragging
    if (e.touches.length === 0) {
      isDragging.current = false;
      
      // If we haven't moved (much), treat it as a tap for fill
      if (!hasMoved.current && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        performFill(touch.clientX, touch.clientY);
      }
    } else if (e.touches.length === 1) {
      // If we went from 2 touches to 1, switch to dragging
      isDragging.current = true;
      isPinching.current = false;
      lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  
  const handleResetZoom = () => {
      transform.current = { k: 1, x: 0, y: 0 };
      updateTransform();
  }

  const handleZoomIn = () => {
      transform.current.k = Math.min(transform.current.k * 1.2, 5);
      updateTransform();
  }

  const handleZoomOut = () => {
      transform.current.k = Math.max(transform.current.k / 1.2, 0.5);
      updateTransform();
  }


  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary link
    const link = document.createElement('a');
    link.download = `${page.title.replace(/\s+/g, '-').toLowerCase()}-colored.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#8B5E6C] touch-none">
      {/* Top Control Bar */}
      <div className="bg-white/10 backdrop-blur-sm p-2 flex items-center justify-between border-b border-white/10 shadow-sm z-10 shrink-0">
        <button 
          onClick={onBack}
          className="bg-[#F4EBD0] hover:bg-[#e8debf] text-[#5D4037] px-2 sm:px-4 py-2 rounded-lg font-black flex items-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-[#5D4037]/20"
        >
          <Home size={20} strokeWidth={2.5} />
          <span className="font-comic text-sm sm:text-lg hidden sm:inline">home</span>
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={handleResetZoom}
             className="bg-[#F4EBD0] hover:bg-[#e8debf] text-[#5D4037] px-3 py-2 rounded-lg font-black flex items-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-[#5D4037]/20"
             title="Reset View"
          >
              <RotateCcw size={20} strokeWidth={2.5} />
          </button>

          <button 
            onClick={initCanvas}
            className="bg-[#F4EBD0] hover:bg-[#e8debf] text-[#5D4037] px-3 py-2 rounded-lg font-black flex items-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-[#5D4037]/20"
          >
            <Eraser size={20} strokeWidth={2.5} />
            <span className="font-comic text-sm sm:text-lg hidden sm:inline">clean</span>
          </button>

          <button 
            onClick={handleDownload}
            className="bg-[#9ACD32] hover:bg-[#8bc125] text-white px-3 py-2 rounded-lg font-black flex items-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-white/20"
          >
            <Download size={20} strokeWidth={2.5} />
            <span className="font-comic text-sm sm:text-lg hidden sm:inline">save</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        className="flex-1 relative flex items-center justify-center overflow-hidden bg-[#8B5E6C] touch-none"
        ref={containerRef}
        onTouchStart={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      >
        <div className="relative shadow-2xl bg-white rounded-xl overflow-hidden max-w-full max-h-full aspect-square border-[4px] border-gray-200 touch-none">
          <canvas 
            ref={canvasRef}
            className="w-full h-full object-contain cursor-crosshair touch-none origin-top-left"
            onClick={handleCanvasClick}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: 'none' }}
          />
        </div>
        
        {/* Zoom Controls Overlay */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <button 
                onClick={handleZoomIn}
                className="bg-white/80 p-2 rounded-full shadow-lg text-gray-700 hover:bg-white active:scale-95"
            >
                <ZoomIn size={24} />
            </button>
            <button 
                onClick={handleZoomOut}
                className="bg-white/80 p-2 rounded-full shadow-lg text-gray-700 hover:bg-white active:scale-95"
            >
                <ZoomOut size={24} />
            </button>
        </div>
      </div>

      {/* Palette Footer */}
      <div className="bg-black/20 p-2 sm:p-3 pb-6 backdrop-blur-sm z-20 shrink-0">
        <div className="flex overflow-x-auto py-2 sm:py-4 gap-2 sm:gap-3 max-w-4xl mx-auto px-4 scrollbar-hide mask-linear-fade items-center">
            {PALETTE_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`
                  flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-md shadow-sm transition-transform duration-100 border-2 border-white/30
                  ${selectedColor === color ? 'scale-110 ring-4 ring-white z-10' : 'hover:scale-105'}
                `}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
