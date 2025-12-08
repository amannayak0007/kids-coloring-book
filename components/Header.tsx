import React from 'react';

export const Header: React.FC = () => {
  const navLinks = [
    { 
      href: 'https://www.amazon.com/Lil-Artist-Featuring-Vegetables-Creatures/dp/B0F9LHDJ4V/ref=sr_1_2?crid=2NXRQSLYUTL8Y&dib=eyJ2IjoiMSJ9.Zb_vhRwcPK1JcAzzuIsGh3jXSB3gELdOJg7IfWMQv3lJxjuXgWBKHjoRGLgDTVsTedlPJ0JqOqpZRFLdPKjAHAWC23qI2GQZ5g6qOyqlEVgeiWtng0zkxtcHMycOgGCE2Gcetm5RzN8MvVWiXhXgo0ZjgyvW2vU2RzaGd2CeZwrK1HjG1qMMjzg8rPtkCF_zBqut7an0E0YInzhdcpZwe9KDc57Ncj5Ob7XMpoILW-k.3cQDHlvh-A3PT0-CIbCNFFeP77IFuggedYuDi0chSAg&dib_tag=se&keywords=Lil+Artist+coloring&qid=1765217278&sprefix=lil+artist+colori%2Caps%2C317&sr=8-2', 
      label: 'Book',
      external: true 
    },
    { href: '#blogs', label: 'Blogs' },
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
              alt="Kids Coloring Web - Free Online Coloring Pages Logo" 
              title="Kids Coloring Web - Free Online Coloring Pages"
              className="w-8 h-8 object-contain"
            />
            Colouring Books For Kids
          </a>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors text-sm font-rounded"
              >
                {link.label}
              </a>
            ))}
            <div className="ml-4 flex items-center gap-2">
              <a
                href="https://www.buymeacoffee.com/AmanJain"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-sm font-rounded flex items-center gap-2"
                title="Buy me a coffee - Support us and help continue creating free content for kids!"
              >
                ☕ Buy Coffee
              </a>
              <a
                href="https://www.paypal.com/paypalme/jainaman"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-sm font-rounded flex items-center gap-2"
                title="Support us with PayPal - Help us continue creating free content for kids!"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                PayPal
              </a>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <details className="relative">
              <summary className="list-none cursor-pointer text-gray-700 hover:text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors text-sm font-rounded"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="border-t border-gray-200 my-2"></div>
                <p className="px-4 py-2 text-xs text-gray-500 italic">
                  Everything is free for kids! Your support helps us create more content.
                </p>
                <div className="px-2 space-y-2 mt-2">
                  <a
                    href="https://www.buymeacoffee.com/AmanJain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all text-sm font-rounded text-center flex items-center justify-center gap-2"
                    title="Buy me a coffee - Support us and help continue creating free content for kids!"
                  >
                    ☕ Buy Me a Coffee
                  </a>
                  <a
                    href="https://www.paypal.com/paypalme/jainaman"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all text-sm font-rounded text-center flex items-center justify-center gap-2"
                    title="Support us with PayPal - Help us continue creating free content for kids!"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    PayPal
                  </a>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
};
