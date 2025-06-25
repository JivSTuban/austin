import React, { useState, useEffect } from "react";
import { useListings } from "@/hooks/useListings";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Search,
  Home,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ensureListingsTable } from "@/lib/helpers/ensureListingsTable";

const Listings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [bedroomFilter, setBedroomFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const listingsPerPage = 9;

  const { listings, loading, totalCount, refetch } = useListings(currentPage, listingsPerPage);

  // Initialize listings table on component mount
  useEffect(() => {
    const initializeTable = async () => {
      try {
        await ensureListingsTable();
      } catch (error) {
        console.error("Error initializing listings table:", error);
      }
    };

    initializeTable();
  }, []);

  // Filter listings based on search query and filters
  const filteredListings = listings.filter((listing) => {
    const matchesSearch = 
      !searchQuery ||
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.address?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice = 
      priceFilter === "all" ||
      (priceFilter === "under-200k" && (listing.price || 0) < 200000) ||
      (priceFilter === "200k-400k" && (listing.price || 0) >= 200000 && (listing.price || 0) < 400000) ||
      (priceFilter === "400k-600k" && (listing.price || 0) >= 400000 && (listing.price || 0) < 600000) ||
      (priceFilter === "over-600k" && (listing.price || 0) >= 600000);

    const matchesBedrooms = 
      bedroomFilter === "all" ||
      (bedroomFilter === "1" && listing.beds === 1) ||
      (bedroomFilter === "2" && listing.beds === 2) ||
      (bedroomFilter === "3" && listing.beds === 3) ||
      (bedroomFilter === "4+" && (listing.beds || 0) >= 4);

    return matchesSearch && matchesPrice && matchesBedrooms;
  });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);
  const startIndex = (currentPage - 1) * listingsPerPage;
  const endIndex = startIndex + listingsPerPage;
  const currentListings = filteredListings.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setPriceFilter("all");
    setBedroomFilter("all");
    setCurrentPage(1);
  };

  // Get active filter count
  const activeFilterCount = [
    searchQuery && "search",
    priceFilter !== "all" && "price",
    bedroomFilter !== "all" && "bedrooms",
  ].filter(Boolean).length;

  return (
    <div className="container mt-10 py-8 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 mb-8 sticky top-0 z-20 pt-4 pb-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span>Active Listings</span>
          <Home className="h-8 w-8 text-green-500" />
        </h1>
        <p className="text-gray-600">
          Discover your next home with our curated selection of properties
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by title or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white border-0 shadow-none focus:ring-0 focus:border-0 focus-visible:ring-2 focus-visible:ring-green-500"
          />
        </div>

        {/* Filter Toggle and Active Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="bg-green-500 text-white h-5 w-5 p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="gap-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refetch}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Price Range
                  </label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-200k">Under $200K</SelectItem>
                      <SelectItem value="200k-400k">$200K - $400K</SelectItem>
                      <SelectItem value="400k-600k">$400K - $600K</SelectItem>
                      <SelectItem value="over-600k">Over $600K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Bedrooms
                  </label>
                  <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bedrooms</SelectItem>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4+">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <span className="ml-2 text-lg">Loading listings...</span>
        </div>
      )}

      {/* Listings Grid */}
      {!loading && (
        <>
          <div className="mb-4 mt-4">
            <p className="text-gray-600">
              {filteredListings.length}{" "}
              {filteredListings.length === 1 ? "listing" : "listings"} found
            </p>
          </div>

          {filteredListings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {/* Pagination */}
              {filteredListings.length > listingsPerPage && (
                <div className="flex items-center justify-between mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredListings.length)} of{" "}
                    {filteredListings.length} listings
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="bg-white hover:bg-green-50 hover:text-green-600 transition-colors border-gray-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {totalPages <= 5 ? (
                        Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (pageNumber) => (
                            <Button
                              key={pageNumber}
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(pageNumber)}
                              className={`w-8 bg-white border-gray-200 ${
                                pageNumber === currentPage
                                  ? "bg-green-500 text-white hover:bg-green-600 hover:text-white border-green-500"
                                  : "hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                              }`}
                            >
                              {pageNumber}
                            </Button>
                          )
                        )
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            className={`w-8 bg-white border-gray-200 ${
                              currentPage === 1
                                ? "bg-green-500 text-white hover:bg-green-600 hover:text-white border-green-500"
                                : "hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                            }`}
                          >
                            1
                          </Button>

                          {currentPage > 3 && (
                            <span className="px-2 text-muted-foreground">...</span>
                          )}

                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((pageNumber) => {
                              if (currentPage <= 3) {
                                return pageNumber > 1 && pageNumber < 5;
                              } else if (currentPage >= totalPages - 2) {
                                return (
                                  pageNumber > totalPages - 4 &&
                                  pageNumber < totalPages
                                );
                              }
                              return (
                                pageNumber >= currentPage - 1 &&
                                pageNumber <= currentPage + 1
                              );
                            })
                            .map((pageNumber) => (
                              <Button
                                key={pageNumber}
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pageNumber)}
                                className={`w-8 bg-white border-gray-200 ${
                                  pageNumber === currentPage
                                    ? "bg-green-500 text-white hover:bg-green-600 hover:text-white border-green-500"
                                    : "hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                                }`}
                              >
                                {pageNumber}
                              </Button>
                            ))}

                          {currentPage < totalPages - 2 && (
                            <span className="px-2 text-muted-foreground">...</span>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            className={`w-8 bg-white border-gray-200 ${
                              currentPage === totalPages
                                ? "bg-green-500 text-white hover:bg-green-600 hover:text-white border-green-500"
                                : "hover:bg-green-50 hover:text-green-600 hover:border-green-300"
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
                      className="bg-white hover:bg-green-50 hover:text-green-600 transition-colors border-gray-200"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="py-12">
              <CardContent>
                <div className="text-center space-y-4">
                  <Home className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No listings found
                  </h3>
                  <p className="text-gray-600">
                    {activeFilterCount > 0
                      ? "Try adjusting your filters to see more results."
                      : "Check back soon for new property listings."}
                  </p>
                  {activeFilterCount > 0 && (
                    <Button variant="outline" onClick={resetFilters}>
                      Clear all filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Listings; 