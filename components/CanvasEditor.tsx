import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ColoringPage } from '../types';
import { PALETTE_COLORS } from '../constants';
import { floodFill } from '../utils/floodFill';
import { Home, Eraser, Download } from 'lucide-react';

interface CanvasEditorProps {
  page: ColoringPage;
  onBack: () => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ page, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE_COLORS[2]); 
  const [isReady, setIsReady] = useState(false);

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
      setIsReady(true);
    };
  }, [page]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    floodFill(ctx, x, y, selectedColor);
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

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#8B5E6C]">
      {/* Top Control Bar */}
      <div className="bg-white/10 backdrop-blur-sm p-2 flex items-center justify-between border-b border-white/10 shadow-sm z-10">
        <button 
          onClick={onBack}
          className="bg-[#F4EBD0] hover:bg-[#e8debf] text-[#5D4037] px-4 py-2 rounded-lg font-black flex items-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-[#5D4037]/20"
        >
          <Home size={24} strokeWidth={2.5} />
          <span className="font-comic text-lg">home</span>
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={initCanvas}
            className="bg-[#F4EBD0] hover:bg-[#e8debf] text-[#5D4037] px-4 py-2 rounded-lg font-black flex items-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-[#5D4037]/20"
          >
            <Eraser size={24} strokeWidth={2.5} />
            <span className="font-comic text-lg">clean</span>
          </button>

          <button 
            onClick={handleDownload}
            className="bg-[#9ACD32] hover:bg-[#8bc125] text-white px-4 py-2 rounded-lg font-black flex items-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-2 border-white/20"
          >
            <Download size={24} strokeWidth={2.5} />
            <span className="font-comic text-lg">save</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
        <div className="relative shadow-2xl bg-white rounded-xl overflow-hidden max-w-full max-h-full aspect-square border-[4px] border-gray-200">
          <canvas 
            ref={canvasRef}
            className="w-full h-full object-contain cursor-crosshair touch-none"
            onClick={handleCanvasClick}
          />
        </div>
      </div>

      {/* Palette Footer */}
      <div className="bg-black/20 p-3 pb-6 backdrop-blur-sm z-20">
        <div className="flex overflow-x-auto py-4 gap-3 max-w-4xl mx-auto px-4 scrollbar-hide mask-linear-fade items-center">
            {PALETTE_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
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
