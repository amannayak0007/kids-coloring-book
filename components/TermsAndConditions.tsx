import React from 'react';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center font-rounded">
          Terms & Conditions
        </h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500 mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Kids Coloring Web, you accept and agree to be bound by the terms and provision 
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">2. Use License</h2>
            <p>
              Permission is granted to temporarily access and use Kids Coloring Web for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>Attempt to decompile or reverse engineer any software contained on Kids Coloring Web</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">3. Ownership</h2>
            <p>
              Kids Coloring Web is owned and operated by <strong>Digital Hole Pvt. Ltd.</strong>
            </p>
            <p>
              <strong>Owner:</strong> Aman Jain
            </p>
            <p>
              <strong>Contact Email:</strong>{' '}
              <a href="mailto:contact@digitalhole.in" className="text-blue-600 hover:underline">
                contact@digitalhole.in
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">4. User Conduct</h2>
            <p>You agree to use Kids Coloring Web only for lawful purposes and in a way that does not infringe the rights of, 
            restrict or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Harassing or causing distress or inconvenience to any person</li>
              <li>Transmitting obscene or offensive content</li>
              <li>Disrupting the normal flow of dialogue within our website</li>
              <li>Attempting to gain unauthorized access to any part of the website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">5. Intellectual Property</h2>
            <p>
              All content, features, and functionality of Kids Coloring Web, including but not limited to text, graphics, 
              logos, icons, images, audio clips, digital downloads, and software, are the property of Digital Hole Pvt. Ltd. 
              or its content suppliers and are protected by international copyright, trademark, patent, trade secret, and 
              other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">6. Disclaimer</h2>
            <p>
              The materials on Kids Coloring Web are provided on an 'as is' basis. Digital Hole Pvt. Ltd. makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of 
              intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">7. Limitations</h2>
            <p>
              In no event shall Digital Hole Pvt. Ltd. or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
              the materials on Kids Coloring Web, even if Digital Hole Pvt. Ltd. or an authorized representative has been 
              notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">8. Accuracy of Materials</h2>
            <p>
              The materials appearing on Kids Coloring Web could include technical, typographical, or photographic errors. 
              Digital Hole Pvt. Ltd. does not warrant that any of the materials on its website are accurate, complete, or current. 
              We may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">9. Links</h2>
            <p>
              Digital Hole Pvt. Ltd. has not reviewed all of the sites linked to our website and is not responsible for the 
              contents of any such linked site. The inclusion of any link does not imply endorsement by Digital Hole Pvt. Ltd. 
              of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">10. Modifications</h2>
            <p>
              Digital Hole Pvt. Ltd. may revise these terms of service for its website at any time without notice. By using 
              this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">11. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably 
              submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 font-rounded">12. Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us:
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

