
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
    <div className="max-w-6xl mx-auto p-4 space-y-10 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl text-white font-bold drop-shadow-md font-comic">
          Coloring Pages For Kids to color online !
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-comic font-bold whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-[#9ACD32] text-white shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-comic font-bold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#9ACD32] text-white shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {category.title.replace('Coloring ', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Regular Categories */}
      {filteredCategories.map((category) => (
        <div key={category.id} className="bg-black/10 rounded-xl p-6 backdrop-blur-sm border border-white/5">
          <div className="flex justify-center mb-6">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md tracking-wide text-center">
              {category.title}
            </h3>
          </div>
          
          {category.items.length > 0 ? (
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
                  
                  {/* "Coloring" Label Overlay */}
                  <div className="absolute top-0 right-0 bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg border-b border-l border-purple-200 flex items-center gap-1">
                    <span>Coloring</span> <Play size={8} fill="currentColor"/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60 font-comic">
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
