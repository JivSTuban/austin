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
  const contactsPerPage = 4;

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

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Investor Package
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            Exclusive investment opportunities in the Austin real estate market
          </p>
        </div>

        <div className="mb-16">
          <Tabs defaultValue="rolodex" className="w-full h-full">
            <TabsList className="grid w-full h-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-8 px-2 pt-2 pb-2 bg-gray-100/80 rounded-lg">
              <TabsTrigger value="rolodex" className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md hover:bg-white/50">
                <Contact className="w-4 h-4" />
                Rolodex
              </TabsTrigger>
              <TabsTrigger value="market" className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md hover:bg-white/50">
                <TrendingUp className="w-4 h-4" />
                Market Analysis
              </TabsTrigger>
              <TabsTrigger value="financing" className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md hover:bg-white/50">
                <DollarSign className="w-4 h-4" />
                Financing
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md hover:bg-white/50">
                <FileText className="w-4 h-4" />
                Resources
              </TabsTrigger>
            </TabsList>

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

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {currentContacts.length > 0 ? (
                  currentContacts.map((contact) => (
                    <RolodexCard 
                      key={contact.id} 
                      initialData={contact} 
                      onUpdate={(updatedContact) => {
                        console.log('Contact updated:', updatedContact);
                      }}
                      className="p-6 sm:p-8"
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

            <TabsContent value="market" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Austin Market Analysis</CardTitle>
                  <CardDescription>
                    Current trends and forecasts for the Austin real estate market
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <BarChart className="w-5 h-5 mr-2 text-blue-600" />
                        Market Highlights
                      </h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-green-600 text-xs font-bold">↑</span>
                          </div>
                          <span>Property values increased by <strong>8.7%</strong> year-over-year</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-green-600 text-xs font-bold">↑</span>
                          </div>
                          <span>Rental rates increased by <strong>5.2%</strong> year-over-year</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-green-600 text-xs font-bold">↓</span>
                          </div>
                          <span>Average days on market decreased to <strong>21 days</strong></span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-blue-600 text-xs font-bold">→</span>
                          </div>
                          <span>Population growth rate of <strong>3.4%</strong> annually</span>
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border rounded-lg">
                        <h4 className="font-medium mb-3">Neighborhood Hotspots</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>East Austin</span>
                            <span className="font-medium text-green-600">12.3% growth</span>
                          </li>
                          <li className="flex justify-between">
                            <span>South Congress</span>
                            <span className="font-medium text-green-600">10.8% growth</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Mueller</span>
                            <span className="font-medium text-green-600">9.5% growth</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Riverside</span>
                            <span className="font-medium text-green-600">8.7% growth</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-6 border rounded-lg">
                        <h4 className="font-medium mb-3">Investment Types</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Single Family Homes</span>
                            <span className="font-medium text-blue-600">7.2% avg ROI</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Multi-Family Units</span>
                            <span className="font-medium text-blue-600">8.5% avg ROI</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Condominiums</span>
                            <span className="font-medium text-blue-600">6.8% avg ROI</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Short-Term Rentals</span>
                            <span className="font-medium text-blue-600">11.2% avg ROI</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Market Report
                  </Button>
                </CardFooter>
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

            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Investor Resources</CardTitle>
                  <CardDescription>
                    Tools, guides, and resources to help you make informed investment decisions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Investment Guides</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-600" />
                            <a href="#" className="text-blue-600 hover:underline">Austin Market Analysis 2023</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-600" />
                            <a href="#" className="text-blue-600 hover:underline">Rental Property Tax Guide</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-600" />
                            <a href="#" className="text-blue-600 hover:underline">Fix & Flip Strategy Guide</a>
                          </li>
                          <li className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-600" />
                            <a href="#" className="text-blue-600 hover:underline">Long-term Investment Blueprint</a>
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
                            <Calculator className="w-4 h-4 mr-2 text-blue-600" />
                            <a href="/calculators" className="text-blue-600 hover:underline">Mortgage Calculator</a>
                          </li>
                          <li className="flex items-center">
                            <Calculator className="w-4 h-4 mr-2 text-blue-600" />
                            <a href="#" className="text-blue-600 hover:underline">ROI Calculator</a>
                          </li>
                          <li className="flex items-center">
                            <Calculator className="w-4 h-4 mr-2 text-blue-600" />
                            <a href="#" className="text-blue-600 hover:underline">Cash Flow Analyzer</a>
                          </li>
                          <li className="flex items-center">
                            <Calculator className="w-4 h-4 mr-2 text-blue-600" />
                            <a href="#" className="text-blue-600 hover:underline">Rehab Cost Estimator</a>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Complete Investor Package
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to start investing?</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Schedule a consultation to discuss your investment goals and get personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline">
              Join Investor Network
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorPackage;