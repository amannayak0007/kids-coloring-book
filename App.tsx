import React, { useState } from 'react';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { CanvasEditor } from './components/CanvasEditor';
import { ColoringPage } from './types';

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<ColoringPage | null>(null);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {selectedPage ? (
        <div className="animate-fade-in">
          <CanvasEditor 
            page={selectedPage} 
            onBack={() => setSelectedPage(null)} 
          />
        </div>
      ) : (
        <div className="animate-fade-in">
          <Header />
          <main className="flex-grow">
            <Gallery onSelectPage={setSelectedPage} />
          </main>
          {/* Modern Footer */}
          <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 text-gray-600 py-12 text-center animate-fade-in">
            <p className="text-sm font-medium">© 2024 Kids Coloring Web. All rights reserved.</p>
            <p className="text-xs mt-3 text-gray-500">Made with ❤️ for little artists</p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
