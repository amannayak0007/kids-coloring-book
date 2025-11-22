import React from 'react';

export const Header: React.FC = () => {
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
    { href: '#privacy', label: 'Privacy' },
    { href: '#terms', label: 'Terms' },
  ];

  return (
    <header className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
            }}
            className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors font-rounded"
          >
            <img 
              src="/icon.png" 
              alt="Colouring Books For Kids" 
              className="w-8 h-8 object-contain"
            />
            Colouring Books For Kids
          </a>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors text-sm font-rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <details className="relative">
              <summary className="list-none cursor-pointer text-gray-700 hover:text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors text-sm font-rounded"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
};
