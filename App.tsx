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
          <footer className="bg-white/10 backdrop-blur-xl border-t border-white/20 text-white/80 py-6 text-center">
            <p className="text-sm font-medium">© 2024 Kids Coloring Web. All rights reserved.</p>
            <p className="text-xs mt-2 text-white/60">Made with ❤️ for little artists</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
