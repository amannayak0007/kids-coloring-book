import React from 'react';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center font-rounded">
          Contact Us
        </h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <p className="text-xl text-center mb-8">
              We'd love to hear from you! Whether you have questions, feedback, suggestions, or need assistance, 
              please don't hesitate to reach out to us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">Get in Touch</h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Company</h3>
                  <p className="text-gray-700">Digital Hole Pvt. Ltd.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Owner</h3>
                  <p className="text-gray-700">Aman Jain</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Email</h3>
                  <p className="text-gray-700">
                    <a 
                      href="mailto:contact@digitalhole.in" 
                      className="text-blue-600 hover:underline font-medium"
                    >
                      contact@digitalhole.in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">What Can We Help You With?</h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>General Inquiries:</strong> Questions about our website or services</li>
              <li><strong>Feedback & Suggestions:</strong> We welcome your ideas to improve Kids Coloring Web</li>
              <li><strong>Technical Support:</strong> Issues with using the website or coloring tools</li>
              <li><strong>Privacy Concerns:</strong> Questions about our privacy practices</li>
              <li><strong>Partnership Opportunities:</strong> Interested in collaborating with us</li>
              <li><strong>Content Requests:</strong> Suggestions for new coloring page categories</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">Response Time</h2>
            <p>
              We aim to respond to all inquiries within 2-3 business days. For urgent matters, please indicate 
              "URGENT" in your email subject line.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">Follow Us</h2>
            <p>
              Stay updated with new coloring pages, features, and updates by checking back regularly. 
              We're constantly working to improve Kids Coloring Web and add new content!
            </p>
          </section>

          <section className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-lg text-gray-800 mb-2">📧 Send Us an Email</h3>
            <p className="text-gray-700 mb-4">
              Click the button below to open your email client and send us a message:
            </p>
            <a
              href="mailto:contact@digitalhole.in?subject=Kids Coloring Web Inquiry"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Send Email
            </a>
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

