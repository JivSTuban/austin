import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, MessageCircle, Star, Building, MapPin, Key } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import ReviewCard from '@/components/ReviewCard';
import { cn } from '@/lib/utils';
import { useAgentData } from '@/hooks/useAgentData';

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
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-50/30 to-transparent opacity-70"></div>
        
        {/* Floating elements */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${showIcons ? 'opacity-100' : 'opacity-0'}`}>
          {/* Top left floating icon */}
          <div className="absolute top-[15%] left-[10%] floating-bounce" style={{ animationDelay: '0.2s' }}>
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4 relative">
              <span className="inline-block relative">
                {typedText}
                <span className={`absolute right-[-8px] top-0 h-full w-[3px] bg-blue-600 ${typedText.length === fullText.length ? 'animate-cursor-blink' : ''}`}></span>
              </span>
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
            <ProfileCard />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent to-gray-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Explore the Market",
                description: "Get access to detailed market insights and property listings to find your perfect match.",
                icon: Home,
                color: "bg-blue-50 text-blue-600",
                link: "/",
                delay: 400
              },
              {
                title: "Read Verified Reviews",
                description: "See what clients say about their experience working with me on their real estate journey.",
                icon: Star,
                color: "bg-amber-50 text-amber-600",
                link: "/reviews",
                delay: 500
              },
              {
                title: "Join the Community",
                description: "Connect with other home buyers, share experiences, and get valuable advice in our forum.",
                icon: MessageCircle,
                color: "bg-green-50 text-green-600",
                link: "/forum",
                delay: 600
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-md"
                style={{
                  opacity: 0,
                  transform: 'translateY(20px)',
                  animation: `fade-in 0.5s ease forwards ${feature.delay}ms`,
                }}
              >
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Listings Section */}
      <section className="py-16 px-6 ">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-austin-dark">
              Featured Listings
            </h2>
            <p className="text-lg text-austin-dark/80 max-w-2xl mx-auto">
              Explore our handpicked selection of premium properties across Austin
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            {/* Listing Card 1 */}
            <div className="listing-card">
              <p 
                style={{ 
                  backgroundImage: "url('https://photos.zillowstatic.com/fp/0487c0f4907b1f34daa72f4e3d29957b-cc_ft_960.jpg')", 
                  backgroundSize: "cover", 
                  backgroundPosition: "center" 
                }}
                onClick={() => window.open('https://www.zillow.com/homedetails/3509-Pittsburg-Ave-Dayton-OH-45406/34964779_zpid/', '_blank')}
              >
                <span>3509 Pittsburg Ave, Dayton, OH 45406</span>
              </p>
              <p style={{ 
                backgroundImage: "url('https://photos.zillowstatic.com/fp/ca279e614e803f05864e850bf0cae134-cc_ft_960.jpg')", 
                backgroundSize: "cover", 
                backgroundPosition: "center" 
              }}
              onClick={() => window.open('https://www.zillow.com/homedetails/3851-Merrimac-Ave-Dayton-OH-45405/34963806_zpid/', '_blank')}
              >
                <span>3851 Merrimac Ave, Dayton, OH 45405</span>
              </p>
              <p style={{ 
                backgroundImage: "url('https://photos.zillowstatic.com/fp/f44175637efd52ae993f7605f600b73d-cc_ft_960.jpg')", 
                backgroundSize: "cover", 
                backgroundPosition: "center" 
              }}
              onClick={() => window.open('https://www.zillow.com/homedetails/123-Notre-Dame-Ave-Dayton-OH-45404/35090037_zpid/', '_blank')}
              >
               <span>123 Notre Dame Ave, Dayton, OH 45404</span>
              </p>
              <p style={{ 
                backgroundImage: "url('https://photos.zillowstatic.com/fp/7d3c34641255ff774c323e480fe25bf2-cc_ft_960.jpg')", 
                backgroundSize: "cover", 
                backgroundPosition: "center" 
              }}
              onClick={() => window.open('https://www.zillow.com/homedetails/1325-1327-Phillips-Ave-Dayton-OH-45410/2056958528_zpid/', '_blank')}
              >
               <span>1325-1327 Phillips Ave, Dayton, OH 45410</span>
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/listings" 
              className="inline-flex items-center px-6 py-3 rounded-full bg-austin-blue text-austin-white hover:bg-austin-blue/90 transition-all"
            >
              View All Listings <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Reviews Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              What Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read about the experiences of satisfied clients who found their dream homes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredReviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/reviews"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              View All Reviews <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent to-blue-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ready to start your real estate journey? Contact me today!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                title: "Email",
                value: agent?.email,
                href: `mailto:${agent?.email}`
              },
              {
                title: "Phone",
                value: agent?.phonecell,
                href: `tel:${agent?.phonecell}`
              },
              {
                title: "Zillow",
                value: "Austin McClain",
                href: "https://www.zillow.com/profile/awmcclain"
              }
            ].map((contact, index) => (
              <a
                key={contact.title}
                href={contact.href}
                className="card-3d glass p-6 rounded-xl text-center transition-all duration-500 hover:shadow-lg transform hover:scale-105"
                style={{
                  opacity: 0,
                  transform: 'translateY(20px)',
                  animation: `fade-in 0.5s ease-out forwards ${400 + index * 100}ms`
                }}
              >
                <h3 className="text-gray-500 text-sm mb-2">{contact.title}</h3>
                <p className="text-lg font-medium text-blue-600">{contact.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
