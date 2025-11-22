import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { CanvasEditor } from './components/CanvasEditor';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { TermsAndConditions } from './components/TermsAndConditions';
import { ColoringPage } from './types';

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<ColoringPage | null>(null);
  const [currentRoute, setCurrentRoute] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      setCurrentRoute(hash);
    };

    // Set initial route
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // If a coloring page is selected, show the editor
  if (selectedPage) {
    return (
      <div className="min-h-screen w-full flex flex-col">
        <div className="animate-fade-in">
          <CanvasEditor 
            page={selectedPage} 
            onBack={() => setSelectedPage(null)} 
          />
        </div>
      </div>
    );
  }

  // Route to different pages based on hash
  const renderPage = () => {
    switch (currentRoute) {
      case 'privacy':
        return <PrivacyPolicy />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'terms':
        return <TermsAndConditions />;
      default:
        return (
          <>
            <Header />
            <main className="flex-grow">
              <Gallery onSelectPage={setSelectedPage} />
            </main>
            {/* Modern Footer */}
            <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 text-gray-600 py-12 animate-fade-in">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#about" className="hover:text-purple-600 transition-colors">About Us</a>
                      </li>
                      <li>
                        <a href="#contact" className="hover:text-purple-600 transition-colors">Contact</a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#privacy" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
                      </li>
                      <li>
                        <a href="#terms" className="hover:text-purple-600 transition-colors">Terms & Conditions</a>
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-4">About</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Free online coloring pages for kids! Color animals, nature, vehicles, mandala, and more.
                    </p>
                    <p className="text-xs text-gray-500">
                      © 2025
                    </p>
                    <p className="text-xs mt-2 text-gray-500">Made with ❤️ for lil artists</p>
                  </div>
                </div>
              </div>
            </footer>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {renderPage()}
    </div>
  );
};

export default App;
