import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ColoringPage } from '../types';
import { PALETTE_COLORS } from '../constants';
import { floodFill } from '../utils/floodFill';
import { Home, Eraser, Download, Undo, Redo, Printer } from 'lucide-react';

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
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gradient-to-br from-purple-200/70 via-pink-100/70 to-blue-200/70 backdrop-blur-md">
      {/* Modern Top Control Bar with Glassmorphism */}
      <div className="bg-white/15 backdrop-blur-xl p-3 sm:p-4 flex items-center justify-between border-b border-white/20 shadow-xl z-10 flex-wrap gap-3">
        <div className="flex gap-2">
          <button 
            onClick={onBack}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/30"
          >
            <Home size={20} strokeWidth={2.5} />
            <span className="text-sm sm:text-base hidden sm:inline">Home</span>
          </button>

          <button 
            onClick={handleUndo}
            disabled={!canUndo}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-2.5 rounded-xl font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Undo size={20} strokeWidth={2.5} />
            <span className="text-sm sm:text-base hidden sm:inline">Undo</span>
          </button>

          <button 
            onClick={handleRedo}
            disabled={!canRedo}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-3 py-2.5 rounded-xl font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Redo size={20} strokeWidth={2.5} />
            <span className="text-sm sm:text-base hidden sm:inline">Redo</span>
          </button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={initCanvas}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2.5 rounded-xl font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/30"
          >
            <Eraser size={20} strokeWidth={2.5} />
            <span className="text-sm sm:text-base hidden sm:inline">Clear</span>
          </button>

          <button 
            onClick={handleDownload}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/30"
          >
            <Download size={20} strokeWidth={2.5} />
            <span className="text-sm sm:text-base hidden sm:inline">Save</span>
          </button>

          <button 
            onClick={handlePrint}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/30"
          >
            <Printer size={20} strokeWidth={2.5} />
            <span className="text-sm sm:text-base hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Modern Main Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-6 overflow-auto" ref={containerRef}>
        <div 
          className="relative shadow-2xl bg-white rounded-3xl overflow-hidden border-4 border-white/40 shadow-2xl"
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

      {/* Modern Palette Footer with Glassmorphism */}
      <div className="bg-white/15 backdrop-blur-xl p-4 sm:p-5 pb-8 border-t border-white/20 shadow-2xl z-20">
        <div className="flex overflow-x-auto py-4 gap-3 sm:gap-4 max-w-5xl mx-auto px-4 scrollbar-hide mask-linear-fade items-center">
          {PALETTE_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`
                flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-lg transition-all duration-300 border-2 border-white/40
                ${selectedColor === color 
                  ? 'scale-125 ring-4 ring-white/80 shadow-2xl shadow-purple-500/50 z-10' 
                  : 'hover:scale-110 hover:shadow-xl hover:border-white/60'
                }
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
