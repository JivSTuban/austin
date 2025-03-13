import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, MessageCircle, Star, Building, MapPin, Key } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import ReviewCard from '@/components/ReviewCard';
import PropertySlider from '@/components/PropertySlider';
import { cn } from '@/lib/utils';
import { useAgentData } from '@/hooks/useAgentData';
import { HoverButton } from "@/components/ui/hover-button";

import { Parallax, ParallaxLayer } from '@react-spring/parallax'


const Index = () => {
  const parallaxRef = useRef(null);
  const { agent, reviews } = useAgentData('X1-ZUtpaayyyrapzd_82rpg');
  const [typedText, setTypedText] = useState('');
  const fullText = "Your Trusted Real Estate Expert";
  const [showSubheading, setShowSubheading] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showIcons, setShowIcons] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Typing effect for headline
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length + 1));
      }, 20);
      return () => clearTimeout(timeout);
    } else {
      // Show subheading after typing completes
      const timeout = setTimeout(() => {
        setShowSubheading(true);
      }, 300);
      
      // Show profile card after subheading appears
      const profileTimeout = setTimeout(() => {
        setShowProfileCard(true);
      }, 800);
      
      // Show floating icons after profile card appears
      const iconsTimeout = setTimeout(() => {
        setShowIcons(true);
      }, 1200);
      
      return () => {
        clearTimeout(timeout);
        clearTimeout(profileTimeout);
        clearTimeout(iconsTimeout);
      };
    }
  }, [typedText]);

  // Featured reviews (just showing the top 3)
  const featuredReviews = reviews.slice(0, 3).map(review => {
    // Extract property type from work description
    const getPropertyType = (desc: string) => {
      if (!desc) return 'Other';
      const description = desc.toLowerCase();
      if (description.includes('single family')) return 'Single Family';
      if (description.includes('multiple occupancy')) return 'Multi-Family';
      if (description.includes('condo')) return 'Condo';
      if (description.includes('apartment')) return 'Apartment';
      return 'Other';
    };

    // Extract buyer type from work description
    const getBuyerType = (desc: string) => {
      if (!desc) return 'Other';
      const description = desc.toLowerCase();
      if (description.startsWith('bought')) return 'Buyer';
      if (description.startsWith('sold')) return 'Seller';
      if (description.includes('bought and sold')) return 'Both';
      return 'Other';
    };

    return {
      id: review.reviewid,
      author: review.reviewername || review.reviewerscreenname || 'Anonymous',
      rating: review.rating,
      createdate: (() => {
        try {
          const date = new Date(review.createdate);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
          }
          return date.toISOString();
        } catch (e) {
          console.error('Error parsing date:', e, 'for review:', review.reviewid);
          return "2025-03-10T00:00:00.000Z"; // Fallback date
        }
      })(),
      title: review.workdescription || 'Review',
      content: review.comment,
      propertyType: getPropertyType(review.workdescription),
      buyerType: getBuyerType(review.workdescription),
      localKnowledge: review.localknowledge,
      processExpertise: review.processexpertise,
      responsiveness: review.responsiveness,
      negotiationSkills: review.negotiationskills
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Parallax ref={parallaxRef} pages={2.3} className="relative">
        {/* Background Image 1 (2.png) */}
        <ParallaxLayer
          offset={0}
          speed={0.3}
          factor={3}
          style={{
            backgroundImage: 'url(/indexImg/2.png)',
            backgroundSize: '100%',
            marginTop: '3%',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />
        
        {/* Background Image 2 (3.png) */}
        <ParallaxLayer
          offset={0}
          speed={0.2}
          factor={3.5}
          style={{
            backgroundImage: 'url(/indexImg/name.svg)',
            backgroundSize: '95%',
            marginTop: '5%',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}

        >
        <div className="absolute inset-0 pointer-events-none">
       
        </div>
        </ParallaxLayer>
      
        {/* Hero Section */}
        <ParallaxLayer offset={0.99} speed={0.5} className="z-2">
          <section className="pt-1 pb-16 px-2 relative overflow-hidden">
            {/* Floating elements */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${showIcons ? 'opacity-100' : 'opacity-0'}`}>
              {/* Top left floating icon */}
              <div className="absolute top-[1%] left-[10%] floating-bounce" style={{ animationDelay: '0.2s' }}>
                <div className="bg-blue-100 p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              
              {/* Top right floating icon */}
              <div className="absolute top-[25%] right-[15%] floating-pulse" style={{ animationDelay: '0.5s' }}>
                <div className="bg-green-100 p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
              </div>
              
              {/* Bottom left floating icon */}
              <div className="absolute bottom-[20%] left-[20%] floating-wave" style={{ animationDelay: '0.8s' }}>
                <div className="bg-amber-100 p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <Key className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              
              {/* Bottom right floating icon */}
              <div className="absolute bottom-[15%] right-[10%] floating-orbit" style={{ animationDelay: '1.1s' }}>
                <div className="bg-purple-100 p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <Home className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              
              {/* Additional floating icons */}
              <div className="absolute top-[45%] left-[25%] floating-pulse" style={{ animationDelay: '1.4s' }}>
                <div className="bg-pink-100 p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <Star className="w-6 h-6 text-pink-600" />
                </div>
              </div>
              
              <div className="absolute top-[35%] right-[30%] floating-bounce" style={{ animationDelay: '1.7s' }}>
                <div className="bg-indigo-100 p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <MessageCircle className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
           
            <div className="max-w-6xl mx-auto text-center relative z-10">
              <div className="mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {typedText}
                  <span className="animate-blink">|</span>
                </h1>
                <p 
                  className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-500 ${showSubheading ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}
                >
                  Helping you find the perfect home with personalized service and local expertise
                </p>
              </div>

              <div 
                className={`transition-all duration-700 transform ${showProfileCard ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                <ProfileCard name="Austin McClain" email="austin@realestate.com" phone="(512) 555-1234" />
              </div>
            </div>
            <div className="text-center mt-10 mb-12">
                <div
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
                >
                 <button 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSf3M-Z5b0mr6ObERDv_1GMyAd66k7ym80dcqjCCxHVmAbaLlA/viewform?usp=sf_link', '_blank')}
                 >
                  See How I Can Help!
                </button>
                </div>
              </div>
          </section>
        </ParallaxLayer>

        {/* Features Section */}
        <ParallaxLayer offset={1.25} speed={0.2} className="z-50">
          <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
             

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                {/* Service 1 */}
                <div 
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Home className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Home Buying</h3>
                  <p className="text-gray-600 mb-4">
                    Find your dream home with personalized search, expert negotiation, and guidance through every step of the buying process.
                  </p>
                  <Link 
                    to="/services" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                {/* Service 2 */}
                <div 
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Building className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Home Selling</h3>
                  <p className="text-gray-600 mb-4">
                    Maximize your home's value with strategic pricing, professional marketing, and skilled negotiation to ensure a smooth selling experience.
                  </p>
                  <Link 
                    to="/services" 
                    className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                  >
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                {/* Service 3 */}
                <div 
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                    <Star className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Investment Properties</h3>
                  <p className="text-gray-600 mb-4">
                    Build your real estate portfolio with expert guidance on investment properties, market analysis, and long-term growth strategies.
                  </p>
                  <Link 
                    to="/investor-package" 
                    className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium"
                  >
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </ParallaxLayer>

        {/* Reviews Section */}
        <ParallaxLayer offset={1.65} speed={0.1} className="z-10">
          <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What My Clients Say</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Don't just take my word for it. Here's what my clients have to say about their experience working with me.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {featuredReviews.map((review, index) => (
                  <ReviewCard 
                    key={review.id}
                    review={review}
                    index={index}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link 
                  to="/reviews" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  View All Reviews <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </section>
        </ParallaxLayer>
      </Parallax>
     
    </div>
  );
};

export default Index;
