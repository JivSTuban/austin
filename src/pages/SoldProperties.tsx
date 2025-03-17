import React, { useState } from "react";
import { useSoldProperties } from "@/hooks/useSoldProperties";
import SoldPropertyCard from "@/components/SoldPropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Search,
  Home,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SoldProperties: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9;

  const { properties, isLoading, error, retry, retryCount, maxRetries } =
    useSoldProperties();

  // Filter properties based on search query, city, and year
  const filteredProperties = properties.filter(
    (property) =>
      (property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.year.toString().includes(searchQuery))
  );

  // Calculate pagination values
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the properties grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mt-10 py-8 px-4 md:px-6">
      <div className="flex flex-col items-start gap-4 mb-8 sticky top-0 z-20 pt-4 pb-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          
          <span>Sold Properties</span>
          <Home className="h-8 w-8 text-blue-500" />
        </h1>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by address, city, or year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-sm text-gray-600 mb-4">
                Retry attempt {retryCount} of {maxRetries}
              </p>
              <Button
                variant="outline"
                onClick={retry}
                disabled={retryCount >= maxRetries}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading properties...</span>
        </div>
      )}

      {/* Properties Grid */}
      {!isLoading && !error && (
        <>
          <div className="mb-4 mt-4">
            <p className="text-gray-600">
              {filteredProperties.length}{" "}
              {filteredProperties.length === 1 ? "property" : "properties"}{" "}
              found
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProperties.map((property) => (
                  <SoldPropertyCard key={property.uuid} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {filteredProperties.length > propertiesPerPage && (
                <div className="flex items-center justify-between mt-8">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredProperties.length)} of{" "}
                    {filteredProperties.length} properties
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {totalPages <= 5 ? (
                        // If total pages is 5 or less, show all page numbers
                        Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (pageNumber) => (
                            <Button
                              key={pageNumber}
                              variant={
                                pageNumber === currentPage
                                  ? "outline"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNumber)}
                              className={`w-8 ${
                                pageNumber === currentPage
                                  ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                                  : "hover:bg-blue-100 hover:text-blue-600"
                              }`}
                            >
                              {pageNumber}
                            </Button>
                          )
                        )
                      ) : (
                        // If more than 5 pages, show limited numbers with ellipsis
                        <>
                          <Button
                            variant={currentPage === 1 ? "outline" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            className={`w-8 ${
                              currentPage === 1
                                ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                                : "hover:bg-blue-100 hover:text-blue-600"
                            }`}
                          >
                            1
                          </Button>

                          {currentPage > 3 && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
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
                                variant={
                                  pageNumber === currentPage
                                    ? "outline"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(pageNumber)}
                                className={`w-8 ${
                                  pageNumber === currentPage
                                    ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                                    : "hover:bg-blue-100 hover:text-blue-600"
                                }`}
                              >
                                {pageNumber}
                              </Button>
                            ))}

                          {currentPage < totalPages - 2 && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}

                          <Button
                            variant={
                              currentPage === totalPages ? "outline" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            className={`w-8 ${
                              currentPage === totalPages
                                ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
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
                      className="hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 border rounded-lg bg-gray-50">
              <Home className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 max-w-md">
                Try adjusting your search to find properties.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SoldProperties;
