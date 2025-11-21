import React, { useState } from 'react';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { CanvasEditor } from './components/CanvasEditor';
import { ColoringPage } from './types';
import { Download } from 'lucide-react';

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<ColoringPage | null>(null);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {selectedPage ? (
        <CanvasEditor 
          page={selectedPage} 
          onBack={() => setSelectedPage(null)} 
        />
      ) : (
        <>
          <Header />
          <main className="flex-grow">
            <Gallery onSelectPage={setSelectedPage} />
          </main>
          {/* Modern Footer */}
          <footer className="bg-white/10 backdrop-blur-xl border-t border-white/20 text-white/80 py-8 text-center">
            {/* Download Button */}
            <div className="mb-6 flex justify-center">
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
            <p className="text-sm font-medium">© 2024 Kids Coloring Web. All rights reserved.</p>
            <p className="text-xs mt-2 text-white/60">Made with ❤️ for little artists</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
