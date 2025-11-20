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
          {/* Simple Footer */}
          <footer className="bg-black/10 text-white/60 py-4 text-center text-sm">
            <p>© 2024 Coloring Book. All rights reserved.</p>
            <p className="text-xs mt-1">Made with ❤️ for little artists</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
