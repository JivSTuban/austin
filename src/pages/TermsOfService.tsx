import { useEffect } from 'react';
import { FileText, Handshake, Shield, AlertTriangle, Scale, RefreshCw, MapPin, Gavel } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-28 h-28 bg-green-100 rounded-full opacity-20 animate-pulse delay-500"></div>
        <div className="absolute top-96 left-16 w-36 h-36 bg-blue-100 rounded-full opacity-15 animate-pulse delay-1500"></div>
        <div className="absolute bottom-48 right-1/3 w-24 h-24 bg-indigo-100 rounded-full opacity-25 animate-pulse delay-3000"></div>
      </div>
      
      <Navbar />
      <div className="flex-grow pt-28 pb-16 px-6 relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <FileText className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 mb-2">Our commitment to clear and fair terms</p>
          <p className="text-sm text-gray-500 bg-white rounded-full px-4 py-2 inline-block shadow-sm">
            Last updated: June 23, 2025
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Handshake className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
              <p className="text-blue-900 leading-relaxed">
                By accessing and using this website (the "Service"), you agree to be bound by these Terms of
                Service and agree that you are responsible for compliance with any applicable local laws.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. Use License</h2>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <div className="flex items-start">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-4 mt-2"></div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">License Granted</h3>
                  <p className="text-green-800 leading-relaxed">
                    Permission is granted to temporarily access the materials (information or software) on Austin
                    McClain's website for personal, non-commercial transitory viewing only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Disclaimer</h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-1" />
                <h3 className="font-semibold text-yellow-900">Important Notice</h3>
              </div>
              <p className="text-yellow-800 leading-relaxed">
                The materials on Austin McClain's website are provided on an 'as is' basis. Austin McClain
                makes no warranties, expressed or implied, and hereby disclaims and negates all other
                warranties including, without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or non-infringement of intellectual
                property or other violation of rights.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Limitations</h2>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
              <p className="text-red-800 leading-relaxed">
                In no event shall Austin McClain or its suppliers be liable for any damages (including,
                without limitation, damages for loss of data or profit, or due to business interruption)
                arising out of the use or inability to use the materials on Austin McClain's website.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Scale className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">5. Accuracy of Materials</h2>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <AlertTriangle className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-800">Technical Errors</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-800">Typographical</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-800">Photographic</p>
                </div>
              </div>
              <p className="text-purple-800 mt-4 text-center leading-relaxed">
                The materials appearing on Austin McClain's website could include technical, typographical,
                or photographic errors. Austin McClain does not warrant that any of the materials on its
                website are accurate, complete, or current.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <Scale className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">6. Links</h2>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-4 mt-2"></div>
                  <span className="text-indigo-800">Austin McClain has not reviewed all linked sites</span>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-4 mt-2"></div>
                  <span className="text-indigo-800">Not responsible for contents of linked sites</span>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-4 mt-2"></div>
                  <span className="text-indigo-800">Links do not imply endorsement</span>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-4 mt-2"></div>
                  <span className="text-indigo-800">Use linked websites at your own risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                <RefreshCw className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">7. Modifications</h2>
            </div>
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
              <div className="flex items-center mb-4">
                <RefreshCw className="w-5 h-5 text-teal-600 mr-3 animate-spin" />
                <h3 className="font-semibold text-teal-900">Terms May Change</h3>
              </div>
              <p className="text-teal-800 leading-relaxed">
                Austin McClain may revise these terms of service for its website at any time without
                notice. By using this website, you are agreeing to be bound by the then current version of
                these terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;