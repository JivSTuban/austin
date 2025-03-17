import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Home,
  MessageCircle,
  Star,
  Building,
  MapPin,
  Key,
  Search,
  Phone,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import ReviewCard from "@/components/ReviewCard";
import { useAgentData } from "@/hooks/useAgentData";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ParallaxContainer,
  ParallaxImage,
  FadeInWhenVisible,
  useForegroundParallax,
} from "@/components/ui/parallax";

import { Listing, useListings } from '@/hooks/useListings';
const Index = () => {
  const { agent, reviews } = useAgentData("X1-ZUtpaayyyrapzd_82rpg");
  const [typedText, setTypedText] = useState("");
  const fullText = "Your Trusted Real Estate Expert";
  const [showSubheading, setShowSubheading] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showTestimonialPopup, setShowTestimonialPopup] = useState(false);
  const [offerDays, setOfferDays] = useState(3);
  const [offerHours, setOfferHours] = useState(12);
  const [offerMinutes, setOfferMinutes] = useState(45);
  const { listings, isLoading, error, fetchListings } = useListings();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);

    // Add scroll listener for floating button
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowFloatingButton(true);
      } else {
        setShowFloatingButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Show testimonial popup after 15 seconds
    const testimonialTimer = setTimeout(() => {
      setShowTestimonialPopup(true);
    }, 15000);
    

    // Countdown timer for offer banner
    const countdownInterval = setInterval(() => {
      setOfferMinutes((prev) => {
        if (prev === 0) {
          setOfferHours((prevHours) => {
            if (prevHours === 0) {
              setOfferDays((prevDays) => Math.max(0, prevDays - 1));
              return 23;
            }
            return prevHours - 1;
          });
          return 59;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(testimonialTimer);
      clearInterval(countdownInterval);
    };
  }, []);

  //listings
  useEffect(() => {
    fetchListings(); // Initial fetch
  }, [fetchListings]);

  // Label configuration based on listing properties
 


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
  const featuredReviews = reviews.slice(0, 3).map((review) => ({
    id: review.reviewid,
    author: review.reviewername || review.reviewerscreenname || "Anonymous",
    rating: review.rating,
    createdate: (() => {
      try {
        const date = new Date(review.createdate);
        if (isNaN(date.getTime())) throw new Error("Invalid date");
        return date.toISOString();
      } catch (e) {
        console.error("Error parsing date:", e, "for review:", review.reviewid);
        return "2025-03-10T00:00:00.000Z";
      }
    })(),
    title: review.workdescription || "Review",
    content: review.comment,
    propertyType: review.workdescription
      ?.toLowerCase()
      .includes("single family")
      ? "Single Family"
      : review.workdescription?.toLowerCase().includes("condo")
      ? "Condo"
      : "Other",
    buyerType: review.workdescription?.toLowerCase().startsWith("bought")
      ? "Buyer"
      : review.workdescription?.toLowerCase().startsWith("sold")
      ? "Seller"
      : "Other",
    localKnowledge: review.localknowledge,
    processExpertise: review.processexpertise,
    responsiveness: review.responsiveness,
    negotiationSkills: review.negotiationskills,
  }));
  const getListingLabel = (listing: Listing) => {
    const lastUpdated = listing.last_updated_from_zillow 
      ? new Date(listing.last_updated_from_zillow) 
      : null;
    const now = new Date();
    const daysDiff = lastUpdated 
      ? Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24)) 
      : Infinity;

    if (daysDiff <= 7) {
      return { text: "New Listing", color: "bg-green-600" };
    }
    if (listing.price && listing.price < 100000) {
      return { text: "Great Value", color: "bg-blue-600" };
    }
    return { text: "Featured", color: "bg-amber-600" };
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Testimonial Popup */}
      <motion.div
        className="fixed bottom-24 left-6 z-50 max-w-xs"
        initial={{ opacity: 0, x: -100 }}
        animate={{
          opacity: showTestimonialPopup ? 1 : 0,
          x: showTestimonialPopup ? 0 : -100,
        }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-100 relative">
          <button
            onClick={() => setShowTestimonialPopup(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold">JD</span>
            </div>
            <div>
              <div className="flex items-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-3 h-3 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-2">
                "Austin helped us find our dream home in just 3 weeks! The
                process was so smooth."
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Just now</span>
                <button
                  onClick={() =>
                    window.open(
                      "https://docs.google.com/forms/d/e/1FAIpQLSf3M-Z5b0mr6ObERDv_1GMyAd66k7ym80dcqjCCxHVmAbaLlA/viewform?usp=sf_link",
                      "_blank"
                    )
                  }
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Get Started →
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Contact Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showFloatingButton ? 1 : 0,
          scale: showFloatingButton ? 1 : 0.8,
          y: showFloatingButton ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-200"></div>
          <button
            onClick={() => window.open("tel:5125551234")}
            className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg"
          >
            <Phone className="h-5 w-5" />
            <span className="font-medium">Call Now</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Hero Section with Parallax */}
      {/* Hero Section */}
      <div className="relative h-[120vh] min-h-[800px] overflow-hidden">
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Background Container */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Background Container with Parallax */}
              <ParallaxContainer>
                {(scrollProps) => (
                  <>
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${
                          import.meta.env.BASE_URL || "/"
                        }indexImg/2.png)`,
                        backgroundSize: "100%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        scale: scrollProps.backgroundScale,
                        y: scrollProps.backgroundY,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `url(${
                          import.meta.env.BASE_URL || "/"
                        }indexImg/name.svg)`,
                        backgroundSize: "100%",
                        backgroundPosition: "center 25%",
                        backgroundRepeat: "no-repeat",
                        filter: "blur(2px)",
                        opacity: scrollProps.watermarkOpacity,
                        y: scrollProps.watermarkY,
                      }}
                    />
                  </>
                )}
              </ParallaxContainer>
            </motion.div>
          </div>

          {/* Foreground Logo */}
          <div className="relative z-10 w-full">
            <motion.div
              className="w-full max-w-5xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                ...useForegroundParallax(),
              }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.div
                className="relative w-full"
                animate={{ y: [-5, 5] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 5,
                  ease: "easeInOut",
                }}
              >@
                <img
                  src={`${import.meta.env.BASE_URL || "/"}indexImg/name.svg`}
                  alt="Austin McClain"
                  className="w-full h-auto select-none opacity-0"
                  style={{
                    filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))",
                  }}
                  loading="eager"
                  decoding="async"
                  onLoad={(e) => {
                    e.currentTarget.classList.remove("opacity-0");
                    e.currentTarget.classList.add(
                      "opacity-100",
                      "transition-opacity",
                      "duration-500"
                    );
                  }}
                  onError={(e) => {
                    console.error("Failed to load logo");
                    const parent = e.currentTarget.closest(
                      "div"
                    ) as HTMLElement;
                    if (parent) {
                      parent.classList.add("hidden");
                    }
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="min-h-screen py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 pt-28">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {typedText}
              <span className="animate-blink">|</span>
            </motion.h1>
            <motion.p
              className={`text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto transition-all duration-500 ${
                showSubheading
                  ? "opacity-100 transform-none"
                  : "opacity-0 translate-y-4"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: showSubheading ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Helping you find the perfect home with personalized service and
              local expertise
            </motion.p>

            <motion.div
              className={`mt-12`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: showProfileCard ? 1 : 0,
                scale: showProfileCard ? 1 : 0.95,
              }}
              transition={{ duration: 0.7 }}
            >
              <ProfileCard
                name="Austin McClain"
                email="austin@realestate.com"
                phone="(512) 555-1234"
              />
            </motion.div>

            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              {/* Enhanced CTA Section */}
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <button
                    className="relative flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg font-medium"
                    onClick={() =>
                      window.open(
                        "https://docs.google.com/forms/d/e/1FAIpQLSf3M-Z5b0mr6ObERDv_1GMyAd66k7ym80dcqjCCxHVmAbaLlA/viewform?usp=sf_link",
                        "_blank"
                      )
                    }
                  >
                    <span>See How I Can Help!</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </button>
                </motion.div>

                <motion.div
                  className="text-sm text-gray-500 max-w-md text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  <span className="font-medium">100+ clients</span> have already
                  found their dream home this year!
                </motion.div>

                <motion.div
                  className="flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm font-medium ml-1">
                    5.0 average rating
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <FadeInWhenVisible>
            <div className="text-center relative py-16">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-1/2 left-0 h-px"
              />
              <motion.div
                className="inline-block relative px-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute -left-4 -top-4">
                  <Home className="w-8 h-8 text-blue-600/20" />
                </div>
                <div className="absolute -right-4 -bottom-4">
                  <Building className="w-8 h-8 text-blue-600/20" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                  Featured Properties
                </h2>
              </motion.div>
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Discover exceptional properties in the most desirable locations
              </motion.p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {listings.slice(0, 3).map((listing, index) => {
                const label = getListingLabel(listing);
                return (
                  <FadeInWhenVisible
                    key={listing.id}
                    delay={index * 0.2}
                    className="h-full"
                  >
                    
                    <div className="rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                      <div className="relative h-64">
                        <img
                          src={listing.imagelink }
                          alt={listing.title || "Property"}
                          className="w-full h-full object-cover"
                         
                          loading="lazy"
                        />
                       
                        <div
                          className={`absolute top-4 left-4 ${label.color} text-white px-3 py-1 rounded-full text-sm font-medium`}
                        >
                          {label.text}
                        </div>
                      </div>
                      <div className="p-6 bg-white/50 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {listing.title || "Untitled Listing"}
                        </h3>
                        <p className="text-gray-600 mb-4">{listing.address}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-blue-600">
                            {listing.price 
                              ? `$${listing.price.toLocaleString()}`
                              : "Price TBD"}
                          </span>
                          <div className="flex items-center text-gray-600 text-sm">
                            <span className="mr-3">{listing.beds || 0} Beds</span>
                            <span className="mr-3">{listing.baths || 0} Baths</span>
                            <span className="mr-3">{listing.sqft || 0} Sq Ft</span>
                          </div>
                        </div>
                        {listing.zillow_link && (
                          <a
                            href={listing.zillow_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block text-blue-600 hover:underline text-sm"
                          >
                            View on Zillow
                          </a>
                        )}
                      </div>
                    </div>
                  </FadeInWhenVisible>
                );
              })}
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

      {/* Reviews Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInWhenVisible className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What My Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take my word for it. Here's what my clients have to say
              about their experience working with me.
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredReviews.map((review, index) => (
              <FadeInWhenVisible key={review.id} delay={index * 0.2}>
                <div className="h-full">
                  <motion.div
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100 h-full flex flex-col"
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {review.author}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                          Other
                        </span>
                        <span className="px-2 py-1 bg-white border border-gray-200 text-gray-700 text-sm rounded-md">
                          {review.buyerType}
                        </span>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-grow">
                      <p className="text-gray-600 line-clamp-6">
                        {review.content}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-pink-100 text-black flex items-center justify-center text-xs font-bold">
                          {review.author.charAt(0)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
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
