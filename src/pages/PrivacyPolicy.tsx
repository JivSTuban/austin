import { useEffect } from 'react';
import { Shield, Eye, Lock, Users, Cookie, Bell } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-indigo-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-purple-100 rounded-full opacity-25 animate-pulse delay-2000"></div>
      </div>
      
      <Navbar />
      <div className="flex-grow pt-28 pb-16 px-6 relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 mb-2">Your privacy matters to us</p>
          <p className="text-sm text-gray-500 bg-white rounded-full px-4 py-2 inline-block shadow-sm">
            Last updated: June 23, 2025
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We collect information that you provide directly to us, including when you:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Create an account</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Fill out forms on our website</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Communicate with us</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Use our services</span>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We use the information we collect to:
            </p>
            <div className="space-y-3">
              <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-4"></div>
                <span className="text-gray-700 font-medium">Provide and improve our services</span>
              </div>
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                <span className="text-gray-700 font-medium">Communicate with you</span>
              </div>
              <div className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div className="w-3 h-3 bg-indigo-500 rounded-full mr-4"></div>
                <span className="text-gray-700 font-medium">Personalize your experience</span>
              </div>
              <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-4"></div>
                <span className="text-gray-700 font-medium">Comply with legal obligations</span>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Information Sharing</h2>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4 rounded-r-lg">
              <p className="text-orange-800 font-semibold">
                We do not sell your personal information.
              </p>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We may share your information with:
            </p>
            <div className="space-y-3">
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 mt-2"></div>
                <span className="text-gray-700">Service providers who assist in our operations</span>
              </div>
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 mt-2"></div>
                <span className="text-gray-700">Professional advisors</span>
              </div>
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 mt-2"></div>
                <span className="text-gray-700">Law enforcement when required by law</span>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Data Security</h2>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal
                information. However, no method of transmission over the Internet is 100% secure.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">5. Your Rights</h2>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              You have the right to:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="font-semibold text-blue-900">Access</span>
                </div>
                <p className="text-blue-800 text-sm ml-5">Access your personal information</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="font-semibold text-green-900">Correct</span>
                </div>
                <p className="text-green-800 text-sm ml-5">Correct inaccurate information</p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  <span className="font-semibold text-red-900">Delete</span>
                </div>
                <p className="text-red-800 text-sm ml-5">Request deletion of your information</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  <span className="font-semibold text-purple-900">Object</span>
                </div>
                <p className="text-purple-800 text-sm ml-5">Object to processing of your information</p>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <Cookie className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">6. Cookies</h2>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100">
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and hold
                certain information. You can instruct your browser to refuse all cookies or to indicate
                when a cookie is being sent.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <Bell className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">7. Changes to This Policy</h2>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
              <p className="text-gray-700 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;