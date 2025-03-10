
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, MessageCircle, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import ReviewCard from '@/components/ReviewCard';
import { cn } from '@/lib/utils';
import { useAgentData } from '@/hooks/useAgentData';

const Index = () => {
  const { agent, reviews } = useAgentData('X1-ZUtpaayyyrapzd_82rpg');

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      id: review.reviewId,
      author: review.reviewerName || review.reviewerScreenName || 'Anonymous',
      rating: review.rating,
      createdate: review.createDate,
      title: review.workDescription || 'Review',
      content: review.comment,
      propertyType: getPropertyType(review.workDescription),
      buyerType: getBuyerType(review.workDescription),
      localKnowledge: review.localKnowledge,
      processExpertise: review.processExpertise,
      responsiveness: review.responsiveness,
      negotiationSkills: review.negotiationSkills
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div
            className="mb-12 opacity-0 animate-fade-in"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
              Your Trusted Real Estate Expert
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Helping you find the perfect home with personalized service and local expertise
            </p>
          </div>

          <ProfileCard />
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
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                Your Real Estate Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover how I can help you at every step of your real estate experience
              </p>
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
