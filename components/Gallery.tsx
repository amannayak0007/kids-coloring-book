
import React from 'react';
import { Category, ColoringPage } from '../types';
import { CATEGORIES } from '../constants';
import { Play } from 'lucide-react';

interface GalleryProps {
  onSelectPage: (page: ColoringPage) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onSelectPage }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl text-white font-bold drop-shadow-md font-comic">
          Coloring Pages For Kids to color online !
        </h2>
      </div>
      
      {CATEGORIES.map((category) => (
        <div key={category.id} className="bg-black/10 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <div className="flex justify-center mb-6">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md tracking-wide text-center">
              {category.title}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {category.items.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelectPage(item)}
                className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-200 border-[3px] border-orange-300 hover:border-orange-500 hover:scale-105 relative overflow-hidden"
              >
                <div className="aspect-square p-2 relative">
                  <img 
                    src={item.thumbnailSrc} 
                    alt={item.title} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* "Coloring" Label Overlay similar to screenshot */}
                <div className="absolute top-0 right-0 bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg border-b border-l border-purple-200 flex items-center gap-1">
                   <span>Coloring</span> <Play size={8} fill="currentColor"/>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
