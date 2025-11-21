import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ColoringPage } from '../types';
import { PALETTE_COLORS } from '../constants';
import { floodFill } from '../utils/floodFill';
import { Home, Eraser, Download, Undo, Redo, ZoomIn, ZoomOut, Printer } from 'lucide-react';

interface CanvasEditorProps {
  page: ColoringPage;
  onBack: () => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ page, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE_COLORS[2]); 
  const [isReady, setIsReady] = useState(false);
  const [zoom, setZoom] = useState<number>(1);
  
  // Undo/Redo state
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const maxHistorySize = 50;

  // Save state to history
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create a deep copy of the current canvas state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const clonedImageData = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    );
    
    // Remove any future history if we're not at the end (user has undone some actions)
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }
    
    // Add new state to history
    historyRef.current.push(clonedImageData);
    
    // Update index to point to the new state
    historyIndexRef.current = historyRef.current.length - 1;
    
    // Limit history size (remove oldest entries if needed)
    while (historyRef.current.length > maxHistorySize) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }
    
    // Update button states
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
      
      // Update button states
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, []);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
      
      // Update button states
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, []);

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
      // This is crucial for transparent PNGs/SVGs to be colorable.
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate scale to fit image
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.85;
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      // Save initial state to history
      const initialImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const clonedInitialImageData = new ImageData(
        new Uint8ClampedArray(initialImageData.data),
        initialImageData.width,
        initialImageData.height
      );
      historyRef.current = [clonedInitialImageData];
      historyIndexRef.current = 0;
      setCanUndo(false);
      setCanRedo(false);
      
      setIsReady(true);
    };
  }, [page, saveToHistory]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);


  // Get canvas coordinates from mouse/touch event
  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);
    
    return { x, y };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    // Perform the fill first
    floodFill(ctx, coords.x, coords.y, selectedColor);
    // Then save the new state AFTER the change
    saveToHistory();
  };

  // Touch event handlers for mobile devices
  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
    if (!coords) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Perform the fill first
    floodFill(ctx, coords.x, coords.y, selectedColor);
    // Then save the new state AFTER the change
    saveToHistory();
  };

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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print - ${page.title}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: white;
            }
            img {
              max-width: 100%;
              height: auto;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            @media print {
              body {
                padding: 0;
              }
              img {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="${page.title}" />
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };


  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#8B5E6C]">
      {/* Top Control Bar */}
      <div className="bg-white/10 backdrop-blur-sm p-2 flex items-center justify-between border-b border-white/10 shadow-sm z-10 flex-wrap gap-2">
        <div className="flex gap-2">
          <button 
            onClick={onBack}
            className="bg-[#F4EBD0] hover:bg-[#e8debf] text-[#5D4037] px-4 py-2 rounded-lg font-black flex items-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-[#5D4037]/20"
          >
            <Home size={20} strokeWidth={2.5} />
            <span className="font-comic text-sm sm:text-lg hidden sm:inline">home</span>
          </button>

          <button 
            onClick={handleUndo}
            disabled={!canUndo}
            className="bg-[#F4EBD0] hover:bg-[#e8debf] text-[#5D4037] px-3 py-2 rounded-lg font-black flex items-center gap-1 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-[#5D4037]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo size={20} strokeWidth={2.5} />
            <span className="font-comic text-sm sm:text-lg hidden sm:inline">undo</span>
          </button>

          <button 
            onClick={handleRedo}
            disabled={!canRedo}
            className="bg-[#F4EBD0] hover:bg-[#e8debf] text-[#5D4037] px-3 py-2 rounded-lg font-black flex items-center gap-1 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-[#5D4037]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Redo size={20} strokeWidth={2.5} />
            <span className="font-comic text-sm sm:text-lg hidden sm:inline">redo</span>
          </button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {/* Zoom Controls */}
          <div className="flex gap-1 bg-black/20 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="bg-transparent hover:bg-white/10 text-white px-2 py-2 rounded-md transition-all"
            >
              <ZoomOut size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleResetZoom}
              className="bg-transparent hover:bg-white/10 text-white px-2 py-1 rounded-md transition-all font-comic text-xs"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="bg-transparent hover:bg-white/10 text-white px-2 py-2 rounded-md transition-all"
            >
              <ZoomIn size={18} strokeWidth={2.5} />
            </button>
          </div>

          <button 
            onClick={initCanvas}
            className="bg-[#F4EBD0] hover:bg-[#e8debf] text-[#5D4037] px-3 py-2 rounded-lg font-black flex items-center gap-1 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-[#5D4037]/20"
          >
            <Eraser size={20} strokeWidth={2.5} />
            <span className="font-comic text-sm sm:text-lg hidden sm:inline">clean</span>
          </button>

          <button 
            onClick={handleDownload}
            className="bg-[#9ACD32] hover:bg-[#8bc125] text-white px-3 py-2 rounded-lg font-black flex items-center gap-1 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-white/20"
          >
            <Download size={20} strokeWidth={2.5} />
            <span className="font-comic text-sm sm:text-lg hidden sm:inline">save</span>
          </button>

          <button 
            onClick={handlePrint}
            className="bg-[#00BFFF] hover:bg-[#0099cc] text-white px-3 py-2 rounded-lg font-black flex items-center gap-1 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-white/20"
          >
            <Printer size={20} strokeWidth={2.5} />
            <span className="font-comic text-sm sm:text-lg hidden sm:inline">print</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-auto" ref={containerRef}>
        <div 
          className="relative shadow-2xl bg-white rounded-xl overflow-hidden border-[4px] border-gray-200"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease',
            width: 'min(90vw, 90vh)',
            height: 'min(90vw, 90vh)',
            maxWidth: '800px',
            maxHeight: '800px'
          }}
        >
          <canvas 
            ref={canvasRef}
            className="w-full h-full object-contain cursor-crosshair"
            onClick={handleCanvasClick}
            onTouchStart={handleCanvasTouchStart}
          />
        </div>
      </div>

      {/* Palette Footer */}
      <div className="bg-black/20 p-3 pb-6 backdrop-blur-sm z-20">
        <div className="flex overflow-x-auto py-4 gap-3 max-w-4xl mx-auto px-4 scrollbar-hide mask-linear-fade items-center">
          {PALETTE_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`
                flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md shadow-sm transition-transform duration-100 border-2 border-white/30
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
