import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building, TrendingUp, DollarSign, FileText, Map, BarChart, Download, ChevronDown, ChevronUp, Home, Users, Calculator, Contact, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Navbar from '@/components/Navbar';
import { useRolodex } from '@/hooks/useRolodex';
import BackgroundShapes from '@/components/BackgroundShapes';
import RolodexCard from '@/components/RolodexCard';
import { FaqSectionWithCategories } from '@/components/ui/faq-section-with-categories';
import { motion } from 'framer-motion';
import { AnimatedCityCard } from '@/components/ui/animated-city-card';

interface PropertyData {
  id: number;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  roi: number;
  capRate: number;
  cashFlow: number;
  imageUrl: string;
}

const InvestorPackage = () => {
  const [expandedProperty, setExpandedProperty] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const { contacts, isLoading, error } = useRolodex();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 6;

  // Extract unique categories from contacts
  const uniqueCategories = useMemo(() => {
    const categories = contacts.map(contact => contact.category);
    return [...new Set(categories)].sort();
  }, [contacts]);

  // Extract unique areas from contacts
  const uniqueAreas = useMemo(() => {
    const areas = contacts.map(contact => contact.area);
    return [...new Set(areas)].sort();
  }, [contacts]);

  const filteredContacts = contacts.filter((contact) => {
    return (
      contact && 
      contact.name && 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === '' || contact.category === selectedCategory) &&
      (selectedArea === '' || contact.area === selectedArea)
    );
  });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const endIndex = startIndex + contactsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const togglePropertyExpansion = (id: number) => {
    setExpandedProperty(expandedProperty === id ? null : id);
  };

  // FAQ data
    const answer1 = `I work as your deal finder and agent, spending most of my time searching for real estate deals. When I find a good one, I'll send it to your email with as much detail as possible. If it matches your buying criteria, I'll draft the offer and represent you throughout the entire closing process.

**How I Find Deals:**

- **Cold Calling**
  - I find property owners' phone numbers from the County Auditor.
  - I call them to see if they're open to receiving an offer on their home.
  - If the numbers make sense, I'll share the info with you.

- **My Network**
  - I connect with as many people as possible in Ohio's real estate market.
  - I ask agents, investors, property managers, and contractors about upcoming deals.

- **The MLS (Multiple Listing Service)**
  - **Newly listed, low-priced properties** – I move quickly to secure offers at asking price.
  - **Stale listings that have lost traction** – I submit low offers to secure below-market deals.`;

    const answer2 = "I find deals through cold calling (contacting property owners directly), my network (other agents, investors, property managers, contractors), and the MLS (targeting both newly listed properties priced low and properties that have been sitting on the market).";
    const answer3 = "The seller usually pays my commission fee. I write in the purchase agreement that the seller pays the commission at closing. If the seller declines to pay any commission and it needs to be paid on the buy side, I'll make it very clear upfront so there are no surprises.";
    const answer4 = "In your offer, we can add an inspection contingency that will give us a certain amount of time to send a licensed inspector to check the property's condition. This time period is normally 7-10 days. The inspection is your chance to make sure there are no hidden material defects (issues that may have a significant, adverse impact on the value of the property, or that pose an unreasonable risk to people).";
    const answer5 = "An 'appraisal gap' is the difference between the appraised value of a home and the purchase price in the sales contract. An 'appraisal gap clause' is used to guarantee that the buyer will cover the monetary gap between the appraisal and the sales contract if an appraisal gap becomes an issue. For example, with a $5k appraisal gap on a $100k property that appraises at $92k, you could either terminate, ask the seller to reduce their price to $97k, or cover the whole gap if the seller won't budge.";


    // FAQ data
    const faqItems = [
      {
        question: "What do you do?",
        answer: answer1,
        category: "Services",
      },
      {
        question: "How do you find deals?",
        answer: answer2,
        category: "Services",
      },
      {
        question: "What are your fees?",
        answer: answer3,
        category: "Fees",
      },
      {
        question: "What happens during the inspection period?",
        answer: answer4,
        category: "Process",
      },
      {
        question: "What is an appraisal gap?",
        answer: answer5,
        category: "Financing",
      },
    ];

  // Tab items for the tubelight navbar
  const tabItems = [
    { name: 'FAQ', url: '#faq', icon: Contact },
    { name: 'Rolodex', url: '#rolodex', icon: Contact },
    { name: 'Major Cities', url: '#major-cities', icon: TrendingUp },
    { name: 'OMX', url: '#omx', icon: FileText },
  ];

  const [activeTab, setActiveTab] = useState('faq');

  return (
    <div className="min-h-screen">
      <div className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
            Investor Package
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">
            Exclusive investment opportunities in the Austin real estate market
          </p>
        </div>

        <div className="mb-10 sm:mb-16">
          <Tabs defaultValue="faq" className="w-full h-full">
            <TabsList className="flex w-full p-1 bg-blue-50 rounded-md">
              {tabItems.map((item) => {
                const Icon = item.icon;
                const tabValue = item.name.toLowerCase().replace(' ', '-');
                return (
                  <TabsTrigger
                    key={item.name}
                    value={tabValue}
                    className="relative flex-1 text-sm font-medium px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    {item.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="faq" className="space-y-8 mt-20">
              <div className="space-y-6 sm:space-y-8">
                <div className="w-full rounded-lg overflow-hidden shadow-md">
                  <video 
                    className="w-full h-auto" 
                    controls 
                    poster="/images/faq-poster.jpg"
                    preload="metadata"
                    playsInline
                  >
                    <source src="/vids/FAQvid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <FaqSectionWithCategories
                  title="Frequently Asked Questions"
                  description="Find answers to common questions about our real estate investment services"
                  items={faqItems}
                />
              </div>
            </TabsContent>

            <TabsContent value="rolodex" className="space-y-8 mt-20 ">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery || ""}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2 bg-white"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                >
                  <option value="">All Areas</option>
                  {uniqueAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">Loading contacts...</p>
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-red-500">Error loading contacts: {typeof error === 'string' ? error : error.message}</p>
                  </div>
                ) : currentContacts.length > 0 ? (
                  currentContacts.map((contact) => (
                    <RolodexCard 
                      key={contact.id} 
                      initialData={contact} 
                      onUpdate={(updatedContact) => {
                        console.log('Contact updated:', updatedContact);
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No contacts found matching your criteria.</p>
                  </div>
                )}
              </div>
              
              {filteredContacts.length > 0 && (
                <div className="flex items-center justify-between mt-8">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length} contacts
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {totalPages <= 7 ? (
                        // If total pages is 7 or less, show all page numbers
                        Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                          <Button
                            key={pageNumber}
                            variant={pageNumber === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNumber)}
                            className={`w-8 ${
                              pageNumber === currentPage
                                ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                                : "hover:bg-blue-100 hover:text-blue-600"
                            }`}
                          >
                            {pageNumber}
                          </Button>
                        ))
                      ) : (
                        // If more than 7 pages, show limited numbers with ellipsis
                        <>
                          {/* First page */}
                          <Button
                            variant={currentPage === 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            className={`w-8 ${
                              currentPage === 1
                                ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                                : "hover:bg-blue-100 hover:text-blue-600"
                            }`}
                          >
                            1
                          </Button>

                          {/* Show ellipsis if not near the start */}
                          {currentPage > 3 && (
                            <span className="px-2 text-muted-foreground">...</span>
                          )}

                          {/* Pages around current page */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(pageNumber => {
                              if (currentPage <= 4) {
                                return pageNumber > 1 && pageNumber < 6;
                              } else if (currentPage >= totalPages - 3) {
                                return pageNumber > totalPages - 5 && pageNumber < totalPages;
                              }
                              return pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1;
                            })
                            .map(pageNumber => (
                              <Button
                                key={pageNumber}
                                variant={pageNumber === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageNumber)}
                                className={`w-8 ${
                                  pageNumber === currentPage
                                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                                    : "hover:bg-blue-100 hover:text-blue-600"
                                }`}
                              >
                                {pageNumber}
                              </Button>
                            ))}

                          {/* Show ellipsis if not near the end */}
                          {currentPage < totalPages - 2 && (
                            <span className="px-2 text-muted-foreground">...</span>
                          )}

                          {/* Last page */}
                          <Button
                            variant={currentPage === totalPages ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            className={`w-8 ${
                              currentPage === totalPages
                                ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                                : "hover:bg-blue-100 hover:text-blue-600"
                            }`}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="major-cities" className="mt-20">
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent mb-3">Major Ohio Cities</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore high-potential investment markets across Ohio's dynamic real estate landscape
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Cleveland */}
                  <motion.div 
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
                    <img 
                      src="/images/Cleveland.png" 
                      alt="Cleveland" 
                      className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold">Cleveland</h3>
                        <span className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm font-medium">Tech Hub</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span className="font-medium">$625K median price</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-400" />
                          <span>8.2% annual appreciation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-purple-400" />
                          <span>Strong rental market</span>
                        </div>
                      </div>
                      <Button className="mt-4 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white border-white/40">
                        View Market Report
                      </Button>
                    </div>
                  </motion.div>

                  {/* Columbus */}
                  <motion.div 
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
                    <img 
                      src="/images/Columbus.png" 
                      alt="Columbus" 
                      className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold">Columbus</h3>
                        <span className="bg-indigo-500/80 text-white px-3 py-1 rounded-full text-sm font-medium">Business Center</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span className="font-medium">$450K median price</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-400" />
                          <span>7.5% annual appreciation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-yellow-400" />
                          <span>Growing population</span>
                        </div>
                      </div>
                      <Button className="mt-4 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white border-white/40">
                        View Market Report
                      </Button>
                    </div>
                  </motion.div>

                  {/* Dayton */}
                  <motion.div 
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
                    <img 
                      src="/images/Dayton.png" 
                      alt="Dayton" 
                      className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold">Dayton</h3>
                        <span className="bg-amber-500/80 text-white px-3 py-1 rounded-full text-sm font-medium">Energy Capital</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span className="font-medium">$350K median price</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-red-400" />
                          <span>9.1% average ROI</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-purple-400" />
                          <span>Affordable entry point</span>
                        </div>
                      </div>
                      <Button className="mt-4 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white border-white/40">
                        View Market Report
                      </Button>
                    </div>
                  </motion.div>

                  {/* Washington Court House */}
                  <motion.div 
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
                    <img 
                      src="/images/Washington.png" 
                      alt="Washington Court House" 
                      className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold">Washington CH</h3>
                        <span className="bg-emerald-500/80 text-white px-3 py-1 rounded-full text-sm font-medium">Historic City</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span className="font-medium">$320K median price</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-orange-400" />
                          <span>High rental demand</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Map className="h-4 w-4 text-blue-400" />
                          <span>Emerging market</span>
                        </div>
                      </div>
                      <Button className="mt-4 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white border-white/40">
                        View Market Report
                      </Button>
                    </div>
                  </motion.div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mt-12">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Want to explore more investment markets?</h3>
                      <p className="text-gray-600 max-w-md">Get our comprehensive Ohio real estate market report with data-driven insights on emerging opportunities.</p>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                      Download Market Report
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financing Options</CardTitle>
                  <CardDescription>
                    Explore various financing solutions for your investment properties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Conventional Investment Loans</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                          <p className="text-sm">
                            Conventional loans for investment properties typically require a down payment of 15-25% 
                            and offer competitive interest rates for qualified investors.
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <h5 className="font-medium mb-1">Current Rates</h5>
                              <ul className="space-y-1">
                                <li>15-year fixed: 5.25%</li>
                                <li>30-year fixed: 5.75%</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium mb-1">Requirements</h5>
                              <ul className="space-y-1">
                                <li>Credit score: 680+</li>
                                <li>DTI ratio: Under 45%</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Portfolio Loans</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                          <p className="text-sm">
                            Portfolio loans are kept by the lender rather than sold on the secondary market, 
                            allowing for more flexible terms for investors with multiple properties.
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <h5 className="font-medium mb-1">Benefits</h5>
                              <ul className="space-y-1">
                                <li>No limit on number of properties</li>
                                <li>Flexible qualification criteria</li>
                                <li>Faster approval process</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium mb-1">Considerations</h5>
                              <ul className="space-y-1">
                                <li>Slightly higher interest rates</li>
                                <li>May require relationship with lender</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Hard Money Loans</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                          <p className="text-sm">
                            Hard money loans are short-term lending options secured by the property, ideal for 
                            fix-and-flip investments or when quick funding is needed.
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <h5 className="font-medium mb-1">Terms</h5>
                              <ul className="space-y-1">
                                <li>Duration: 6-24 months</li>
                                <li>Interest rates: 8-12%</li>
                                <li>Loan-to-value: Up to 75%</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium mb-1">Best For</h5>
                              <ul className="space-y-1">
                                <li>Fix and flip projects</li>
                                <li>Investors needing quick closing</li>
                                <li>Properties needing renovation</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Private Equity Partnerships</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                          <p className="text-sm">
                            Partner with private equity investors to fund larger projects or build a portfolio 
                            of investment properties with shared risk and returns.
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <h5 className="font-medium mb-1">Structure Options</h5>
                              <ul className="space-y-1">
                                <li>Joint ventures</li>
                                <li>Equity partnerships</li>
                                <li>Syndications</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium mb-1">Advantages</h5>
                              <ul className="space-y-1">
                                <li>Access to larger capital</li>
                                <li>Shared risk</li>
                                <li>Combined expertise</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4">
                  <Button className="w-full sm:w-auto">
                    Schedule Financing Consultation
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Compare Lender Options
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="omx" className="space-y-4 sm:space-y-6 mt-20">
            <div className="w-full rounded-lg overflow-hidden shadow-md">
             <h2 style={{ textAlign: 'center' }}> Austin Off Market Exclusive Explaination</h2>
             <br />
                  <video 
                    className="w-full h-auto" 
                    controls 
                    poster="/images/resourcesVid.jpg"
                    preload="metadata"
                    playsInline
                    onTimeUpdate={(e) => {
                      // Limit playback to 43 seconds
                      const video = e.target as HTMLVideoElement;
                      if (video.currentTime > 43) {
                        video.pause();
                      }
                    }}
                  >
                    <source src="/vids/resourcesVid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to start investing?</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Schedule a consultation to discuss your investment goals and get personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base" asChild>
              <a href="https://forms.gle/TByiP2G4KWQQmeRDA" target="_blank" rel="noopener noreferrer">Schedule Consultation</a>
            </Button>
            <Button size="lg" variant="outline" className="text-sm sm:text-base" asChild>
              <Link to="/forum">Join Investor Network</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorPackage;
