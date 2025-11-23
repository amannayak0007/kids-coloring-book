
import React, { useState, useMemo } from 'react';
import { Category, ColoringPage } from '../types';
import { CATEGORIES } from '../constants';

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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-16 pb-20">
      <div className="text-center mb-12 sm:mb-16 pt-2 sm:pt-4 md:pt-6 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 tracking-tight">
          Free Coloring Pages
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 font-medium font-rounded">
          Discover hundreds of beautiful coloring pages for kids
        </p>
        {/* Download Button */}
        <div className="flex justify-center">
          <a
            href="https://apps.apple.com/us/app/colouring-and-drawing-for-kids/id6446801004"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all font-rounded"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span>Download on the App Store</span>
          </a>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 mb-12 shadow-sm border border-gray-200/50 animate-slide-in-left">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all font-rounded ${
              selectedCategory === null
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.title.replace('Coloring ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Categories */}
      {filteredCategories.map((category, categoryIndex) => (
        <div key={category.id} className="space-y-8 animate-fade-in" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
          <div className="flex justify-center">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 animate-scale-in tracking-tight">
              {category.title}
            </h2>
          </div>
          
          {category.items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {/* Empty Canvas - Draw & Create Card (First Position) - Hidden on mobile/compact devices */}
              <div 
                onClick={() => onSelectPage({
                  id: 'empty-canvas',
                  title: 'Empty Canvas - Draw & Create',
                  imageSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg==',
                  thumbnailSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg=='
                })}
                className="hidden md:block group cursor-pointer bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl shadow-sm hover:shadow-xl transition-all border-2 border-purple-200 hover:border-purple-300 overflow-hidden card-hover grid-item"
                style={{ animationDelay: `${categoryIndex * 0.1}s` }}
              >
                <div className="aspect-square p-4 sm:p-5 flex flex-col items-center justify-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 group-hover:scale-110 transition-transform duration-500">
                    ✏️🎨🖌️
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors text-center">
                    Draw & Create
                  </h3>
                </div>
              </div>
              
              {/* Regular Coloring Pages */}
              {category.items.map((item, itemIndex) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectPage(item)}
                  className="group cursor-pointer bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-200/50 hover:border-gray-300 overflow-hidden card-hover grid-item"
                  style={{ animationDelay: `${(categoryIndex * 0.1) + ((itemIndex + 1) * 0.03)}s` }}
                >
                  <div className="aspect-square p-5">
                    <img 
                      src={item.thumbnailSrc} 
                      alt={item.title} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 font-medium animate-fade-in">
              No coloring pages found in this category.
            </div>
          )}
        </div>
      ))}

      {/* No Results Message */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No coloring pages found in this category.</p>
        </div>
      )}
    </div>
  );
};
