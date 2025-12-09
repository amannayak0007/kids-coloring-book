import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { CanvasEditor } from './components/CanvasEditor';
import { DoodlingEditor } from './components/DoodlingEditor';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { TermsAndConditions } from './components/TermsAndConditions';
import { Blogs } from './components/Blogs';
import { AdSense } from './components/AdSense';
import { ColoringPage } from './types';

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<ColoringPage | null>(null);
  const [showDoodling, setShowDoodling] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<string>('');

  // SEO: Update meta tags dynamically based on route
  useEffect(() => {
    const updateMetaTags = (route: string) => {
      const baseUrl = 'https://kidscoloringweb.com';
      let title = 'Free Online Kids Coloring Pages - Digital Coloring Book for Children';
      let description = 'Free online coloring pages for kids! Color animals, nature, vehicles, mandala, and more. Interactive digital coloring book with hundreds of printable coloring pages.';
      let canonical = baseUrl;

      switch (route) {
        case 'about':
          title = 'About Us - Kids Coloring Web | Free Online Coloring Pages';
          description = 'Learn about Kids Coloring Web - your free online coloring book for kids. Discover our mission to provide fun, educational coloring pages for children.';
          canonical = `${baseUrl}/#about`;
          break;
        case 'contact':
          title = 'Contact Us - Kids Coloring Web | Get in Touch';
          description = 'Contact Kids Coloring Web. Have questions or feedback? We\'d love to hear from you about our free online coloring pages for kids.';
          canonical = `${baseUrl}/#contact`;
          break;
        case 'blogs':
          title = 'Coloring Blog - Tips, Ideas & Activities for Kids | Kids Coloring Web';
          description = 'Discover coloring tips, creative ideas, and fun activities for kids. Read our blog about coloring pages, art education, and children\'s creativity.';
          canonical = `${baseUrl}/#blogs`;
          break;
        case 'privacy':
          title = 'Privacy Policy - Kids Coloring Web';
          description = 'Read our privacy policy to understand how we protect your information on Kids Coloring Web.';
          canonical = `${baseUrl}/#privacy`;
          break;
        case 'terms':
          title = 'Terms and Conditions - Kids Coloring Web';
          description = 'Read our terms and conditions for using Kids Coloring Web\'s free online coloring pages.';
          canonical = `${baseUrl}/#terms`;
          break;
        case 'doodling':
          title = 'Doodling - Draw on Shapes | Kids Coloring Web';
          description = 'Get a new shape every day! Rotate, flip, and draw on shapes to release your creative potential. With Dudel Draw, explore your imagination with daily shapes.';
          canonical = `${baseUrl}/#doodling`;
          break;
        default:
          title = 'Free Online Kids Coloring Pages - Digital Coloring Book for Children';
          description = 'Free online coloring pages for kids! Color animals, nature, vehicles, mandala, and more. Interactive digital coloring book with hundreds of printable coloring pages.';
          canonical = baseUrl;
      }

      // Update title
      document.title = title;

      // Update or create meta tags
      const updateMetaTag = (name: string, content: string, isProperty = false) => {
        const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let meta = document.querySelector(selector) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          if (isProperty) {
            meta.setAttribute('property', name);
          } else {
            meta.setAttribute('name', name);
          }
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Update description
      updateMetaTag('description', description);
      updateMetaTag('og:description', description, true);
      updateMetaTag('twitter:description', description);

      // Update title
      updateMetaTag('title', title);
      updateMetaTag('og:title', title, true);
      updateMetaTag('twitter:title', title);

      // Update canonical
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);

      // Update OG URL
      updateMetaTag('og:url', canonical, true);
      updateMetaTag('twitter:url', canonical);
    };

    updateMetaTags(currentRoute);
  }, [currentRoute]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      setCurrentRoute(hash);
      if (hash === 'doodling') {
        setShowDoodling(true);
      } else {
        setShowDoodling(false);
      }
    };

    // Set initial route
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const exitDoodling = () => {
    setShowDoodling(false);
    setCurrentRoute('');
    // Clear the hash so subsequent taps on "Doodling" trigger navigation again
    window.location.hash = '';
  };

  // If doodling is selected, show the doodling editor
  if (showDoodling) {
    return (
      <div className="min-h-screen w-full flex flex-col">
        <div className="animate-fade-in">
          <DoodlingEditor 
            onBack={exitDoodling} 
          />
        </div>
      </div>
    );
  }

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

  // Wrapper component for content pages with ads
  const ContentPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <>
      {/* Top Ad Space - Web Only */}
      <div className="w-full bg-gray-50/50 py-4 flex justify-center items-center">
        <div className="max-w-7xl w-full px-4">
          <AdSense 
            className="mx-auto"
            style={{ minHeight: '100px', maxWidth: '728px', margin: '0 auto' }}
          />
        </div>
      </div>
      {children}
      {/* Bottom Ad Space - Web Only */}
      <div className="w-full flex justify-center items-center">
        <div className="max-w-7xl w-full">
          <AdSense 
            className="mx-auto"
            style={{ minHeight: '90px', maxWidth: '728px', margin: '0 auto' }}
          />
        </div>
      </div>
    </>
  );

  // Route to different pages based on hash
  const renderPage = () => {
    switch (currentRoute) {
      case 'privacy':
        return (
          <ContentPageWrapper>
            <PrivacyPolicy />
          </ContentPageWrapper>
        );
      case 'about':
        return (
          <ContentPageWrapper>
            <About />
          </ContentPageWrapper>
        );
      case 'contact':
        return (
          <ContentPageWrapper>
            <Contact />
          </ContentPageWrapper>
        );
      case 'terms':
        return (
          <ContentPageWrapper>
            <TermsAndConditions />
          </ContentPageWrapper>
        );
      case 'blogs':
        return (
          <ContentPageWrapper>
            <Blogs />
          </ContentPageWrapper>
        );
      default:
        return (
          <>
            <Header />
            <main className="flex-grow">
              <Gallery onSelectPage={setSelectedPage} />
            </main>
            {/* Bottom Ad Space - Web Only */}
            <div className="w-full flex justify-center items-center">
              <div className="max-w-7xl w-full">
                <AdSense 
                  className="mx-auto"
                  style={{ minHeight: '90px', maxWidth: '728px', margin: '0 auto' }}
                />
              </div>
            </div>
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
                    <p className="text-xs mt-2 text-gray-500">
                      Made with ❤️ by{' '}
                      <a 
                        href="https://digitalhole.in/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-purple-600 transition-colors"
                      >
                        Digital Hole Pvt. Ltd.
                      </a>
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200/50 pt-8 mt-8 text-center">
                  <a
                    href="https://apps.apple.com/gb/developer/digital-hole-pvt-ltd/id917701060"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    Check out Our mobile Apps
                  </a>
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
