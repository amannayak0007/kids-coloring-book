import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ColoringPage } from '../types';
import { PALETTE_COLORS } from '../constants';
import { floodFill } from '../utils/floodFill';
import { Home, Eraser, Download, Undo, Redo, Printer, Paintbrush, Pen, Brush, Droplet } from 'lucide-react';

interface CanvasEditorProps {
  page: ColoringPage;
  onBack: () => void;
}

type ToolType = 'fill' | 'brush' | 'pen' | 'paintbrush' | 'spray' | 'eraser';

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ page, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE_COLORS[2]); 
  const [isReady, setIsReady] = useState(false);
  const [zoom, setZoom] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  
  // Drawing tools state
  const isEmptyCanvas = page.id === 'empty-canvas';
  const [selectedTool, setSelectedTool] = useState<ToolType>(isEmptyCanvas ? 'brush' : 'fill');
  const [brushSize, setBrushSize] = useState<number>(20);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const previousPointRef = useRef<{ x: number; y: number } | null>(null);

  // Cute cursor builder for all drawing/fill interactions
  const createCuteCursor = useCallback((color: string) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
        <path d="M4 2 L4 31 L12 23 L18 35 L22 33 L16 21 L27 21 Z" fill="${color}" stroke="%23ffffff" stroke-width="2" stroke-linejoin="round"/>
      </svg>
    `;
    // Hotspot near the tip of the arrow for precise coloring
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 4 2, auto`;
  }, []);

  const cursorStyle = useMemo(() => createCuteCursor(selectedColor), [createCuteCursor, selectedColor]);
  
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

    // High resolution internal canvas
    const internalWidth = 1024; 
    const internalHeight = 1024;
    
    canvas.width = internalWidth;
    canvas.height = internalHeight;

    // Fill background with WHITE first
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isEmptyCanvas) {
      // Empty canvas - just white background
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
    } else {
      // Load image for coloring pages
      const img = new Image();
      img.src = page.imageSrc;
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
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
    }
  }, [page, isEmptyCanvas, saveToHistory]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Switch away from black color when on coloring pages (not empty canvas)
  useEffect(() => {
    if (!isEmptyCanvas && selectedColor === '#000000') {
      // Find first non-black color from palette
      const nonBlackColor = PALETTE_COLORS.find(color => color !== '#000000');
      if (nonBlackColor) {
        setSelectedColor(nonBlackColor);
      }
    }
  }, [isEmptyCanvas, selectedColor]);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/bubble.wav');
    audioRef.current.preload = 'auto';
    audioRef.current.volume = 0.5;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Initialize and play background music when canvas is ready
  useEffect(() => {
    if (isReady) {
      backgroundMusicRef.current = new Audio('/storybg.mp3');
      backgroundMusicRef.current.preload = 'auto';
      backgroundMusicRef.current.volume = 0.5;
      backgroundMusicRef.current.loop = true; // Loop the background music
      
      // Play the background music
      backgroundMusicRef.current.play().catch((error) => {
        // Ignore errors (e.g., if user hasn't interacted with page yet)
        console.log('Background music play failed:', error);
      });
    }
    
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, [isReady]);

  // Play sound effect
  const playFillSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play().catch(() => {
        // Ignore errors (e.g., if user hasn't interacted with page yet)
      });
    }
  }, []);


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

  // Spray tool drawing function - creates random scatter of dots
  const drawSpray = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const sprayRadius = brushSize * 1.5;
    const density = Math.max(10, Math.floor(brushSize / 2)); // Number of dots per spray
    
    ctx.fillStyle = selectedColor;
    ctx.globalAlpha = 0.7;
    
    for (let i = 0; i < density; i++) {
      // Random angle and distance within spray radius
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * sprayRadius;
      const dotX = x + Math.cos(angle) * distance;
      const dotY = y + Math.sin(angle) * distance;
      
      // Random dot size (smaller dots for more realistic spray effect)
      const dotSize = Math.random() * 3 + 1;
      
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1.0;
  }, [selectedColor, brushSize]);

  // Drawing function for different tools with smooth curves
  const draw = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, lastX: number | null, lastY: number | null, midX?: number, midY?: number) => {
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (selectedTool === 'fill') {
      if (lastX === null || lastY === null) {
        floodFill(ctx, x, y, selectedColor);
      }
      return;
    }

    // Eraser tool - uses destination-out composite to erase
    if (selectedTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = brushSize;
      ctx.shadowBlur = 0;
      // Eraser doesn't need color, but we'll continue to drawing logic
    } else {
      // Reset composite operation for drawing tools
      ctx.globalCompositeOperation = 'source-over';
    }

    // Set tool-specific properties with distinct differences
    if (selectedTool === 'pen') {
      // Pen: Thin, solid, precise lines
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = Math.max(2, brushSize * 0.2);
      ctx.shadowBlur = 0;
    } else if (selectedTool === 'brush') {
      // Brush: Medium, slightly soft
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = brushSize;
      ctx.shadowBlur = 2;
      ctx.shadowColor = selectedColor;
    } else if (selectedTool === 'paintbrush') {
      // Paintbrush: Large, very soft, more transparent
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = brushSize * 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = selectedColor;
    } else if (selectedTool === 'spray') {
      // Spray: Random scatter of dots
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = selectedColor;
      return; // Spray is handled separately
    }

    // Draw smooth continuous lines using quadratic curves
    if (lastX !== null && lastY !== null) {
      ctx.beginPath();
      
      if (midX !== undefined && midY !== undefined) {
        // Use quadratic curve for smoother lines
        ctx.moveTo(lastX, lastY);
        ctx.quadraticCurveTo(midX, midY, x, y);
      } else {
        // Straight line if no midpoint
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
      }
      
      ctx.stroke();
    } else {
      // For the first point, draw a circle
      ctx.beginPath();
      ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Reset shadow, alpha, and composite operation
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  }, [selectedTool, selectedColor, brushSize]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isReady) return;
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setIsDrawing(true);
    // Initialize points for smooth drawing
    lastPointRef.current = { x: coords.x, y: coords.y };
    previousPointRef.current = { x: coords.x, y: coords.y };

    if (selectedTool === 'fill') {
      floodFill(ctx, coords.x, coords.y, selectedColor);
      saveToHistory();
      setIsDrawing(false);
      lastPointRef.current = null;
      previousPointRef.current = null;
    } else {
      // Draw initial point for drawing tools
      draw(ctx, coords.x, coords.y, null, null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isReady || !isDrawing || selectedTool === 'fill') return;
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (selectedTool === 'spray') {
      // Spray tool - draw spray effect at current position
      drawSpray(ctx, coords.x, coords.y);
      lastPointRef.current = { x: coords.x, y: coords.y };
    } else {
      const lastPoint = lastPointRef.current;
      const previousPoint = previousPointRef.current;
      
      if (lastPoint) {
        // Use midpoint for smooth quadratic curves
        let midX = lastPoint.x;
        let midY = lastPoint.y;
        
        if (previousPoint) {
          // Calculate midpoint between previous and last point for smoother curves
          midX = (previousPoint.x + lastPoint.x) / 2;
          midY = (previousPoint.y + lastPoint.y) / 2;
        }
        
        // Draw smooth curve from last point through midpoint to current point
        draw(ctx, coords.x, coords.y, lastPoint.x, lastPoint.y, midX, midY);
        
        // Update points for next iteration
        previousPointRef.current = { x: lastPoint.x, y: lastPoint.y };
        lastPointRef.current = { x: coords.x, y: coords.y };
      }
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing && selectedTool !== 'fill') {
      saveToHistory();
    }
    setIsDrawing(false);
    lastPointRef.current = null;
    previousPointRef.current = null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Only handle click for fill tool when not drawing
    if (selectedTool === 'fill' && !isDrawing) {
      handleCanvasMouseDown(e);
    }
  };

  // Touch event handlers for mobile devices
  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isReady) return;
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setIsDrawing(true);
    // Initialize points for smooth drawing
    lastPointRef.current = { x: coords.x, y: coords.y };
    previousPointRef.current = { x: coords.x, y: coords.y };

    if (selectedTool === 'fill') {
      floodFill(ctx, coords.x, coords.y, selectedColor);
      saveToHistory();
      setIsDrawing(false);
      lastPointRef.current = null;
      previousPointRef.current = null;
    } else if (selectedTool === 'spray') {
      // Spray tool - draw spray effect
      drawSpray(ctx, coords.x, coords.y);
    } else {
      // Draw initial point for other drawing tools
      draw(ctx, coords.x, coords.y, null, null);
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isReady || !isDrawing || selectedTool === 'fill') return;
    const touch = e.touches[0];
    const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (selectedTool === 'spray') {
      // Spray tool - draw spray effect at current position
      drawSpray(ctx, coords.x, coords.y);
      lastPointRef.current = { x: coords.x, y: coords.y };
    } else {
      const lastPoint = lastPointRef.current;
      const previousPoint = previousPointRef.current;
      
      if (lastPoint) {
        // Use midpoint for smooth quadratic curves
        let midX = lastPoint.x;
        let midY = lastPoint.y;
        
        if (previousPoint) {
          // Calculate midpoint between previous and last point for smoother curves
          midX = (previousPoint.x + lastPoint.x) / 2;
          midY = (previousPoint.y + lastPoint.y) / 2;
        }
        
        // Draw smooth curve from last point through midpoint to current point
        draw(ctx, coords.x, coords.y, lastPoint.x, lastPoint.y, midX, midY);
        
        // Update points for next iteration
        previousPointRef.current = { x: lastPoint.x, y: lastPoint.y };
        lastPointRef.current = { x: coords.x, y: coords.y };
      }
    }
  };

  const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isDrawing && selectedTool !== 'fill') {
      saveToHistory();
    }
    setIsDrawing(false);
    lastPointRef.current = null;
    previousPointRef.current = null;
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
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gray-50 safe-area-container">
      <style>{`
        .safe-area-container {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
        .top-bar-safe {
          padding-top: calc(1rem + env(safe-area-inset-top));
          padding-bottom: 0.75rem;
        }
        @media (min-width: 640px) {
          .top-bar-safe {
            padding-top: 1.25rem;
            padding-bottom: 1.25rem;
          }
        }
        .color-bar-safe {
          padding-top: 1rem;
          padding-bottom: calc(1rem + env(safe-area-inset-bottom));
        }
        @media (min-width: 640px) {
          .color-bar-safe {
            padding-top: 1.25rem;
            padding-bottom: 1.25rem;
          }
        }
        .canvas-container {
          width: min(85vw, calc(100vh - 200px));
          height: min(85vw, calc(100vh - 200px));
          max-width: 100%;
          max-height: 100%;
        }
        @media (min-width: 640px) {
          .canvas-container {
            width: min(75vw, calc(100vh - 250px));
            height: min(75vw, calc(100vh - 250px));
          }
        }
        @media (min-width: 1024px) {
          .canvas-container {
            width: min(70vw, 70vh);
            height: min(70vw, 70vh);
          }
        }
      `}</style>
      {/* Modern Top Control Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 top-bar-safe px-4 sm:px-5 flex items-center justify-between z-10 gap-3 shadow-sm animate-slide-in-left overflow-x-auto">
        <div className="flex gap-3 items-center flex-shrink-0">
          <button 
            onClick={() => {
              playFillSound();
              onBack();
            }}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all font-rounded flex-shrink-0"
          >
            <Home size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Home</span>
          </button>

          <button 
            onClick={() => {
              playFillSound();
              handleUndo();
            }}
            disabled={!canUndo}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-rounded flex-shrink-0"
          >
            <Undo size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Undo</span>
          </button>

          <button 
            onClick={() => {
              playFillSound();
              handleRedo();
            }}
            disabled={!canRedo}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-rounded flex-shrink-0"
          >
            <Redo size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Redo</span>
          </button>
        </div>
        
        <div className="flex gap-3 items-center flex-shrink-0">
          <button 
            onClick={() => {
              playFillSound();
              initCanvas();
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all font-rounded flex-shrink-0"
          >
            <Eraser size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Clear</span>
          </button>

          <button 
            onClick={() => {
              playFillSound();
              handleDownload();
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all flex-shrink-0"
          >
            <Download size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Save</span>
          </button>

          <button 
            onClick={() => {
              playFillSound();
              handlePrint();
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all flex-shrink-0"
          >
            <Printer size={18} />
            <span className="text-sm sm:text-base hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Tool Selection Bar - Only show for empty canvas */}
      {isEmptyCanvas && (
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-5 py-3 z-10 shadow-sm">
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            {/* Brush Tool */}
            <button
              onClick={() => {
                playFillSound();
                setSelectedTool('brush');
              }}
              className={`px-4 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all flex-shrink-0 ${
                selectedTool === 'brush'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Brush Tool"
            >
              <Brush size={20} />
              <span className="text-sm sm:text-base">Brush</span>
            </button>

            {/* Pen Tool */}
            <button
              onClick={() => {
                playFillSound();
                setSelectedTool('pen');
              }}
              className={`px-4 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all flex-shrink-0 ${
                selectedTool === 'pen'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Pen Tool"
            >
              <Pen size={20} />
              <span className="text-sm sm:text-base">Pen</span>
            </button>

            {/* Paintbrush Tool */}
            <button
              onClick={() => {
                playFillSound();
                setSelectedTool('paintbrush');
              }}
              className={`px-4 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all flex-shrink-0 ${
                selectedTool === 'paintbrush'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Paintbrush Tool"
            >
              <Paintbrush size={20} />
              <span className="text-sm sm:text-base">Paintbrush</span>
            </button>

            {/* Spray Tool */}
            <button
              onClick={() => {
                playFillSound();
                setSelectedTool('spray');
              }}
              className={`px-4 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all flex-shrink-0 ${
                selectedTool === 'spray'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Spray Tool"
            >
              <Droplet size={20} />
              <span className="text-sm sm:text-base">Spray</span>
            </button>

            {/* Eraser Tool */}
            <button
              onClick={() => {
                playFillSound();
                setSelectedTool('eraser');
              }}
              className={`px-4 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all flex-shrink-0 ${
                selectedTool === 'eraser'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Eraser Tool"
            >
              <Eraser size={20} />
              <span className="text-sm sm:text-base">Eraser</span>
            </button>

            {/* Brush Size Control */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-full">
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Size:</span>
              <input
                type="range"
                min="5"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 sm:w-32 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-600"
                style={{
                  background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((brushSize - 5) / 45) * 100}%, #d1d5db ${((brushSize - 5) / 45) * 100}%, #d1d5db 100%)`
                }}
              />
              <span className="text-sm font-medium text-gray-700 w-8 text-center">{brushSize}</span>
            </div>
          </div>
        </div>
      )}

      {/* Modern Main Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center px-2 sm:px-4 md:px-6 py-2 sm:py-4 md:py-8 overflow-hidden min-h-0" ref={containerRef}>
        <div 
          className="canvas-container relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/50 shadow-2xl animate-scale-in"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          <canvas 
            ref={canvasRef}
            className="w-full h-full object-contain"
            style={{ cursor: cursorStyle }}
            onClick={handleCanvasClick}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onTouchStart={handleCanvasTouchStart}
            onTouchMove={handleCanvasTouchMove}
            onTouchEnd={handleCanvasTouchEnd}
          />
        </div>
      </div>

      {/* Modern Palette Footer */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 color-bar-safe px-3 sm:px-4 z-20 shadow-sm animate-slide-in-right">
        <div className="flex overflow-x-auto py-2 gap-2 sm:gap-3 max-w-5xl mx-auto px-3 sm:px-4 scrollbar-hide items-center">
          {PALETTE_COLORS.filter(color => isEmptyCanvas || color !== '#000000').map((color, index) => (
            <button
              key={color}
              onClick={() => {
                playFillSound();
                handleColorChange(color);
              }}
              className={`
                flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full transition-all border-2 shadow-sm hover:shadow-md color-button grid-item
                ${selectedColor === color 
                  ? 'ring-4 ring-gray-900 scale-110 border-gray-900' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              style={{ 
                backgroundColor: color,
                animationDelay: `${index * 0.02}s`
              }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
