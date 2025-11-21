
import React, { useState, useMemo } from 'react';
import { Category, ColoringPage } from '../types';
import { CATEGORIES } from '../constants';
import { Play } from 'lucide-react';

interface GalleryProps {
  onSelectPage: (page: ColoringPage) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onSelectPage }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter categories and items based on category filter
  const filteredCategories = useMemo(() => {
    let filtered = CATEGORIES;

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(cat => cat.id === selectedCategory);
    }

    return filtered;
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
          Free Coloring Pages
        </h1>
        <p className="text-lg sm:text-xl text-white/90 font-medium max-w-2xl mx-auto mb-6">
          Discover hundreds of beautiful coloring pages for kids. Color online, print, and share your artwork!
        </p>
        {/* Download Button */}
        <div className="flex justify-center">
          <a
            href="https://apps.apple.com/us/app/colouring-and-drawing-for-kids/id6446801004"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 hover:scale-110 active:scale-105 transition-all duration-300 border-2 border-white/40"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span>Download on the App Store</span>
          </a>
        </div>
      </div>

      {/* Modern Filter Bar with Glassmorphism */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 mb-8 border border-white/20 shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105 backdrop-blur-sm'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105 backdrop-blur-sm'
                }`}
              >
                {category.title.replace('Coloring ', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Categories with Glassmorphism */}
      {filteredCategories.map((category) => (
        <div key={category.id} className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="flex justify-center mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-2xl text-center bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              {category.title}
            </h2>
          </div>
          
          {category.items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {category.items.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectPage(item)}
                  className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 border-2 border-white/30 hover:border-purple-300 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="aspect-square p-3 sm:p-4 relative">
                    <img 
                      src={item.thumbnailSrc} 
                      alt={item.title} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Modern Label Overlay */}
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 backdrop-blur-sm">
                    <span>Color</span> <Play size={10} fill="currentColor"/>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-pink-400/0 group-hover:from-purple-400/10 group-hover:to-pink-400/10 transition-all duration-300 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-white/70 font-medium text-lg">
              No coloring pages found in this category.
            </div>
          )}
        </div>
      ))}

      {/* No Results Message */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12 text-white/60">
          <p className="font-comic text-lg">No coloring pages found in this category.</p>
        </div>
      )}
    </div>
  );
};
