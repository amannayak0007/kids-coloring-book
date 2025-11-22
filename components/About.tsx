import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center font-rounded">
          About Us
        </h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">Welcome to Kids Coloring Web!</h2>
            <p>
              Kids Coloring Web is a free, interactive online coloring platform designed specifically for children. 
              We believe that creativity and artistic expression are essential for a child's development, and we've 
              created a safe, fun, and engaging space where kids can explore their imagination through coloring.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">Our Mission</h2>
            <p>
              Our mission is to provide children with a safe, free, and enjoyable digital coloring experience. 
              We aim to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Encourage creativity and artistic expression</li>
              <li>Provide a wide variety of coloring pages across multiple categories</li>
              <li>Ensure a safe, privacy-focused environment for children</li>
              <li>Make coloring accessible to everyone, anywhere, anytime</li>
              <li>Support learning and development through fun activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">What We Offer</h2>
            <p>Kids Coloring Web features:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Hundreds of Free Coloring Pages:</strong> Animals, nature, vehicles, mandalas, and more</li>
              <li><strong>Interactive Coloring Tools:</strong> Easy-to-use fill tool and color palette</li>
              <li><strong>Multiple Categories:</strong> From animals and nature to cultural designs and geometric patterns</li>
              <li><strong>No Registration Required:</strong> Start coloring immediately, no sign-up needed</li>
              <li><strong>Privacy-Focused:</strong> All coloring happens locally in your browser</li>
              <li><strong>Mobile-Friendly:</strong> Works on tablets, phones, and computers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">Our Commitment to Safety</h2>
            <p>
              We take children's safety and privacy seriously. Our platform:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Does not require registration or personal information</li>
              <li>Complies with COPPA (Children's Online Privacy Protection Act)</li>
              <li>Does not store or transmit children's artwork or data</li>
              <li>Uses appropriate content filtering and safety measures</li>
              <li>Provides a safe, ad-appropriate environment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">Company Information</h2>
            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <p><strong>Company:</strong> Digital Hole Pvt. Ltd.</p>
              <p><strong>Owner:</strong> Aman Jain</p>
              <p>
                <strong>Contact:</strong>{' '}
                <a href="mailto:contact@digitalhole.in" className="text-blue-600 hover:underline">
                  contact@digitalhole.in
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">Get in Touch</h2>
            <p>
              We love hearing from parents, teachers, and children! If you have questions, suggestions, 
              or feedback, please don't hesitate to reach out to us at{' '}
              <a href="mailto:contact@digitalhole.in" className="text-blue-600 hover:underline">
                contact@digitalhole.in
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">Thank You!</h2>
            <p>
              Thank you for choosing Kids Coloring Web. We hope your children enjoy their creative journey 
              with us. Happy coloring! 🎨
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
            }}
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

