import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, MessageCircle, Star, Building, MapPin, Key, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import ReviewCard from '@/components/ReviewCard';
import { useAgentData } from '@/hooks/useAgentData';
import { Parallax, ParallaxImage, FadeInWhenVisible } from '@/components/ui/parallax';
import { motion } from 'framer-motion';

const Index = () => {
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
      const timeout = setTimeout(() => setShowSubheading(true), 300);
      const profileTimeout = setTimeout(() => setShowProfileCard(true), 800);
      const iconsTimeout = setTimeout(() => setShowIcons(true), 1200);
      return () => {
        clearTimeout(timeout);
        clearTimeout(profileTimeout);
        clearTimeout(iconsTimeout);
      };
    }
  }, [typedText]);

  // Featured reviews
  const featuredReviews = reviews.slice(0, 3).map(review => ({
    id: review.reviewid,
    author: review.reviewername || review.reviewerscreenname || 'Anonymous',
    rating: review.rating,
    createdate: (() => {
      try {
        const date = new Date(review.createdate);
        if (isNaN(date.getTime())) throw new Error('Invalid date');
        return date.toISOString();
      } catch (e) {
        console.error('Error parsing date:', e, 'for review:', review.reviewid);
        return "2025-03-10T00:00:00.000Z";
      }
    })(),
    title: review.workdescription || 'Review',
    content: review.comment,
    propertyType: review.workdescription?.toLowerCase().includes('single family') ? 'Single Family' :
                 review.workdescription?.toLowerCase().includes('condo') ? 'Condo' : 'Other',
    buyerType: review.workdescription?.toLowerCase().startsWith('bought') ? 'Buyer' :
               review.workdescription?.toLowerCase().startsWith('sold') ? 'Seller' : 'Other',
    localKnowledge: review.localknowledge,
    processExpertise: review.processexpertise,
    responsiveness: review.responsiveness,
    negotiationSkills: review.negotiationskills,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Parallax */}
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
        {/* Background Images with Parallax */}
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src="/indexImg/2.png"
            alt="Background"
            className="absolute inset-0 opacity-60"
            speed={0.3}
          />
          <Parallax className="absolute inset-0" speed={0.2} direction="down">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/indexImg/name.svg)', backgroundSize: '90%', marginBottom: '30%' }}
            />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        </div>

        {/* Floating Elements with Motion */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${showIcons ? 'opacity-100' : 'opacity-0'}`}>
          <motion.div 
            className="absolute top-[20%] left-[10%]"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <div className="bg-blue-100 p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </motion.div>
          <motion.div 
            className="absolute top-[25%] right-[15%]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <div className="bg-green-100 p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </motion.div>
          <motion.div 
            className="absolute bottom-[25%] right-[10%]"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <div className="bg-purple-100 p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
              <Home className="w-6 h-6 text-purple-600" />
            </div>
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4 pt-28 pb-16">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{marginTop: '130%'}}></div>
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {typedText}
              <span className="animate-blink">|</span>
            </motion.h1>
            <motion.p
              className={`text-xl md:text-2xl text-white/90 max-w-3xl mx-auto transition-all duration-500 ${showSubheading ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: showSubheading ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Helping you find the perfect home with personalized service and local expertise
            </motion.p>

            <motion.div 
              className={`mt-12`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: showProfileCard ? 1 : 0, 
                scale: showProfileCard ? 1 : 0.95 
              }}
              transition={{ duration: 0.7 }}
            >
              <ProfileCard name="Austin McClain" email="austin@realestate.com" phone="(512) 555-1234" />
            </motion.div>

            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <button
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg font-medium"
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSf3M-Z5b0mr6ObERDv_1GMyAd66k7ym80dcqjCCxHVmAbaLlA/viewform?usp=sf_link', '_blank')}
              >
                See How I Can Help!
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <section className="py-24 px-6 bg-gray-50 relative overflow-hidden">
        <Parallax className="absolute inset-0 z-0" speed={0.1} direction="down">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-50 opacity-70"></div>
        </Parallax>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInWhenVisible className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exceptional properties in the most desirable locations
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Modern Luxury Home", address: "123 Main St, Austin, TX", price: "$750,000", beds: 4, baths: 3, sqft: "2,400", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", label: "For Sale", labelColor: "bg-blue-600" },
              { title: "Charming Suburban Home", address: "456 Oak St, Austin, TX", price: "$525,000", beds: 3, baths: 2, sqft: "1,850", img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", label: "New Listing", labelColor: "bg-green-600" },
              { title: "Downtown Luxury Condo", address: "789 Tower Ave, Austin, TX", price: "$625,000", beds: 2, baths: 2, sqft: "1,200", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", label: "Featured", labelColor: "bg-amber-600" },
            ].map((property, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.2} className="h-full">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                  <div className="relative h-64">
                    <ParallaxImage 
                      src={property.img} 
                      alt={property.title} 
                      className="w-full h-full" 
                      speed={0.1}
                    />
                    <div className={`absolute top-4 left-4 ${property.labelColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {property.label}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-4">{property.address}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-600">{property.price}</span>
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="mr-3">{property.beds} Beds</span>
                        <span className="mr-3">{property.baths} Baths</span>
                        <span>{property.sqft} Sq Ft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          <FadeInWhenVisible className="text-center mt-16" delay={0.4}>
            <Link
              to="/investor-package"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              View All Properties <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <Parallax className="absolute inset-0 z-0" speed={0.15} direction="up">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-white opacity-70"></div>
        </Parallax>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInWhenVisible className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">My Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive real estate services tailored to your needs
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <Home className="w-10 h-10 text-blue-600" />, title: "Home Buying", description: "Find your dream home with personalized search, expert negotiation, and guidance through every step of the buying process.", link: "/services", color: "text-blue-600 hover:text-blue-800" },
              { icon: <Building className="w-10 h-10 text-green-600" />, title: "Home Selling", description: "Maximize your home's value with strategic pricing, professional marketing, and skilled negotiation to ensure a smooth selling experience.", link: "/services", color: "text-green-600 hover:text-green-800" },
              { icon: <Star className="w-10 h-10 text-amber-600" />, title: "Investment Properties", description: "Build your real estate portfolio with expert guidance on investment properties, market analysis, and long-term growth strategies.", link: "/investor-package", color: "text-amber-600 hover:text-amber-800" },
            ].map((service, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.2}>
                <div className="bg-white rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full">
                  <motion.div 
                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6"
                    whileHover={{ rotate: 10, scale: 1.05 }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link to={service.link} className={`inline-flex items-center ${service.color} font-medium`}>
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 px-6 bg-gray-50 relative overflow-hidden">
        <Parallax className="absolute inset-0 z-0" speed={0.1} direction="down">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 opacity-70"></div>
        </Parallax>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInWhenVisible className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What My Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take my word for it. Here's what my clients have to say about their experience working with me.
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredReviews.map((review, index) => (
              <FadeInWhenVisible key={review.id} delay={index * 0.2}>
                <motion.div 
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100 h-full"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <ReviewCard review={review} index={index} />
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>

          <FadeInWhenVisible className="text-center mt-16" delay={0.4}>
            <Link
              to="/reviews"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              View All Reviews <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </FadeInWhenVisible>
        </div>
      </section>
    </div>
  );
};

export default Index;