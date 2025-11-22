import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center font-rounded">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500 mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">1. Introduction</h2>
            <p>
              Welcome to Kids Coloring Web. We are committed to protecting your privacy and ensuring a safe experience for children and their families. This Privacy Policy explains how we collect, use, and safeguard information when you use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">2. Company Information</h2>
            <p>
              This website is owned and operated by <strong>Digital Hole Pvt. Ltd.</strong>
            </p>
            <p>
              <strong>Owner:</strong> Aman Jain
            </p>
            <p>
              <strong>Contact Email:</strong> <a href="mailto:contact@digitalhole.in" className="text-blue-600 hover:underline">contact@digitalhole.in</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">3. Information We Collect</h2>
            <p>
              Kids Coloring Web is designed to be privacy-friendly. We collect minimal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Usage Data:</strong> We may collect anonymous usage statistics to improve our service, such as which coloring pages are most popular.</li>
              <li><strong>Cookies:</strong> We use cookies for essential website functionality and analytics. We do not use cookies to track personal information.</li>
              <li><strong>No Personal Information:</strong> We do not require registration, and we do not collect names, email addresses, or any personally identifiable information from children or adults.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">4. Children's Privacy (COPPA Compliance)</h2>
            <p>
              Kids Coloring Web is designed for children and complies with the Children's Online Privacy Protection Act (COPPA):
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>We do not knowingly collect personal information from children under 13 years of age.</li>
              <li>No registration or account creation is required to use our service.</li>
              <li>All coloring activities are performed locally in your browser - we do not store or transmit your artwork.</li>
              <li>We do not use persistent identifiers to track children across websites.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">5. How We Use Information</h2>
            <p>Any anonymous data we collect is used solely to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Improve website functionality and user experience</li>
              <li>Understand which features are most popular</li>
              <li>Ensure website security and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">6. Third-Party Services</h2>
            <p>
              We use Google AdSense to display advertisements on our website. Google AdSense may use cookies and similar technologies to serve personalized ads. You can learn more about how Google uses data at{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Google's Privacy Policy
              </a>.
            </p>
            <p className="mt-4">
              You can opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Google's Ad Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">7. Data Security</h2>
            <p>
              We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of data. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Request information about what data we collect (if any)</li>
              <li>Request deletion of any data we may have collected</li>
              <li>Opt out of cookies through your browser settings</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:contact@digitalhole.in" className="text-blue-600 hover:underline">contact@digitalhole.in</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <p><strong>Digital Hole Pvt. Ltd.</strong></p>
              <p><strong>Owner:</strong> Aman Jain</p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:contact@digitalhole.in" className="text-blue-600 hover:underline">
                  contact@digitalhole.in
                </a>
              </p>
            </div>
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

