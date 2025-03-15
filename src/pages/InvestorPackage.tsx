import { useState, useMemo } from 'react';
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
  const faqItems = [
    {
      question: "What do you do?",
      answer: (
        <>
          <p>
            I work as your deal finder and agent, spending most of my time searching for real estate deals. 
            When I find a good one, I’ll send it to your email with as much detail as possible. 
            If it matches your buying criteria, I’ll draft the offer and represent you throughout the entire closing process.
          </p>
  
          <p><strong>How I Find Deals:</strong></p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Cold Calling</strong>
              <ul className="list-disc pl-5">
                <li>I find property owners’ phone numbers from the County Auditor.</li>
                <li>I call them to see if they’re open to receiving an offer on their home.</li>
                <li>If the numbers make sense, I’ll share the info with you.</li>
              </ul>
            </li>
  
            <li>
              <strong>My Network</strong>
              <ul className="list-disc pl-5">
                <li>I connect with as many people as possible in Ohio’s real estate market.</li>
                <li>I ask agents, investors, property managers, and contractors about upcoming deals.</li>
              </ul>
            </li>
  
            <li>
              <strong>The MLS (Multiple Listing Service)</strong>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Newly listed, low-priced properties</strong> – I move quickly to secure offers at asking price.
                </li>
                <li>
                  <strong>Stale listings that have lost traction</strong> – I submit low offers to secure below-market deals.
                </li>
              </ul>
            </li>
          </ul>
        </>
      ),
      category: "Services",
    },
    {
      question: "How do you find deals?",
      answer: "I find deals through cold calling (contacting property owners directly), my network (other agents, investors, property managers, contractors), and the MLS (targeting both newly listed properties priced low and properties that have been sitting on the market).",
      category: "Services",
    },
    {
      question: "What are your fees?",
      answer: "The seller usually pays my commission fee. I write in the purchase agreement that the seller pays the commission at closing. If the seller declines to pay any commission and it needs to be paid on the buy side, I'll make it very clear upfront so there are no surprises.",
      category: "Fees",
    },
    {
      question: "What happens during the inspection period?",
      answer: "In your offer, we can add an inspection contingency that will give us a certain amount of time to send a licensed inspector to check the property's condition. This time period is normally 7-10 days. The inspection is your chance to make sure there are no hidden material defects (issues that may have a significant, adverse impact on the value of the property, or that pose an unreasonable risk to people).",
      category: "Process",
    },
    {
      question: "What is an appraisal gap?",
      answer: "An 'appraisal gap' is the difference between the appraised value of a home and the purchase price in the sales contract. An 'appraisal gap clause' is used to guarantee that the buyer will cover the monetary gap between the appraisal and the sales contract if an appraisal gap becomes an issue. For example, with a $5k appraisal gap on a $100k property that appraises at $92k, you could either terminate, ask the seller to reduce their price to $97k, or cover the whole gap if the seller won't budge.",
      category: "Financing",
    },
  ];

  // Tab items for the tubelight navbar
  const tabItems = [
    { name: 'FAQ', url: '#faq', icon: Contact },
    { name: 'Rolodex', url: '#rolodex', icon: Contact },
    { name: 'Major Cities', url: '#major-cities', icon: TrendingUp },
    { name: 'Resources', url: '#resources', icon: FileText },
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
            <TabsList className="flex justify-center mb-6 sm:mb-8 bg-transparent overflow-x-auto pb-2 sm:pb-0 w-full">
              <div className="flex items-center gap-1 sm:gap-3 bg-gray-100/80 border border-gray-200 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
                {tabItems.map((item) => {
                  const Icon = item.icon;
                  const tabValue = item.name.toLowerCase().replace(' ', '-');

                  return (
                    <TabsTrigger
                      key={item.name}
                      value={tabValue}
                      className="relative cursor-pointer text-xs sm:text-sm font-semibold px-3 sm:px-6 py-2 rounded-full transition-colors text-gray-600 hover:text-blue-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap"
                    >
                      <span className="hidden sm:inline">{item.name}</span>
                      <span className="sm:hidden">
                        <Icon size={18} strokeWidth={2.5} />
                      </span>
                      <div
                        className="absolute inset-0 w-full bg-white rounded-full -z-10 opacity-0 data-[state=active]:opacity-100"
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-t-full">
                          <div className="absolute w-12 h-6 bg-blue-600/20 rounded-full blur-md -top-2 -left-2" />
                          <div className="absolute w-8 h-6 bg-blue-600/20 rounded-full blur-md -top-1" />
                          <div className="absolute w-4 h-4 bg-blue-600/20 rounded-full blur-sm top-0 left-2" />
                        </div>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </div>
            </TabsList>

            <TabsContent value="faq" className="space-y-8">
              <FaqSectionWithCategories
                title="Frequently Asked Questions"
                description="Find answers to common questions about our real estate investment services"
                items={faqItems}
                contactInfo={{
                  title: "Still have questions?",
                  description: "Feel free to reach out for more information about our investment services.",
                  buttonText: "Contact Me",
                  onContact: () => console.log("Contact button clicked"),
                }}
              />
            </TabsContent>

            <TabsContent value="rolodex" className="space-y-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
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
                {currentContacts.length > 0 ? (
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
                            className="w-8"
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
                            className="w-8"
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
                                className="w-8"
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
                            className="w-8"
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
              
              <div className="flex justify-center mt-8">
                <Button variant="outline" className="mr-4">
                  Load More Contacts
                </Button>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Add New Contact
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="major-cities" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-xl sm:text-2xl">Major Texas Cities</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Explore investment opportunities in major Texas cities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 justify-items-center">
                      <AnimatedCityCard 
                        cityName="Cleveland"
                        description="Tech Hub"
                        price="$625K median"
                        bgImage="/images/Cleveland.png"
                      />
                      <AnimatedCityCard 
                        cityName="Columbus"
                        description="Business Center"
                        price="$450K median"
                        bgImage="/images/Columbus.png"
                      />
                      <AnimatedCityCard 
                        cityName="Dayton"
                        description="Energy Capital"
                        price="$350K median"
                        bgImage="/images/Dayton.png"
                      />
                      <AnimatedCityCard 
                        cityName="Washington Court House "
                        description="Historic City"
                        price="$320K median"
                        bgImage="/images/Washington.png"
                      />
                    </div>
                  </div>
                </CardContent>
                
              </Card>
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

            <TabsContent value="resources" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-xl sm:text-2xl">Investor Resources</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Tools, guides, and resources to help you make informed investment decisions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Investment Guides</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                            <a href="#" className="text-blue-600 hover:underline text-sm sm:text-base">Austin Market Analysis 2023</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                            <a href="#" className="text-blue-600 hover:underline text-sm sm:text-base">Rental Property Tax Guide</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                            <a href="#" className="text-blue-600 hover:underline text-sm sm:text-base">Fix & Flip Strategy Guide</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                            <a href="#" className="text-blue-600 hover:underline text-sm sm:text-base">Long-term Investment Blueprint</a>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Calculators & Tools</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <Calculator className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                            <a href="/calculators" className="text-blue-600 hover:underline text-sm sm:text-base">Mortgage Calculator</a>
                          </li>
                          <li className="flex items-center">
                            <Calculator className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                            <a href="#" className="text-blue-600 hover:underline text-sm sm:text-base">ROI Calculator</a>
                          </li>
                          <li className="flex items-center">
                            <Calculator className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                            <a href="#" className="text-blue-600 hover:underline text-sm sm:text-base">Cash Flow Analyzer</a>
                          </li>
                          <li className="flex items-center">
                            <Calculator className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                            <a href="#" className="text-blue-600 hover:underline text-sm sm:text-base">Rehab Cost Estimator</a>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full text-sm sm:text-base">
                    <Download className="w-4 h-4 mr-2" />
                    Download Complete Investor Package
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to start investing?</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Schedule a consultation to discuss your investment goals and get personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="text-sm sm:text-base">
              Join Investor Network
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorPackage;