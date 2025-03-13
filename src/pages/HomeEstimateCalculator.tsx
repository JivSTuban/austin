import { useState, useEffect, useCallback } from 'react';
import { Calculator, Home, DollarSign, Ruler, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-sonner';
import Navbar from '@/components/Navbar';

interface HomeEstimateResult {
  estimatedValue: number;
  valueRange: {
    low: number;
    high: number;
  };
  comparables: ComparableProperty[];
}

interface ComparableProperty {
  id: string;
  address: string;
  price: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  pricePerSqft: number;
}

const HomeEstimateCalculator = () => {
  const { toast } = useToast();
  const [squareFootage, setSquareFootage] = useState(1000);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [yearBuilt, setYearBuilt] = useState(2000);
  const [zipCode, setZipCode] = useState('');
  const [propertyType, setPropertyType] = useState('single-family');
  const [lotSize, setLotSize] = useState(0.25);
  const [estimateResult, setEstimateResult] = useState<HomeEstimateResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Generate mock comparable properties
  const generateComparables = useCallback(() => {
    const basePrice = squareFootage * 250; // Base price per square foot
    const bedroomValue = bedrooms * 15000;
    const bathroomValue = bathrooms * 20000;
    const ageValue = (2023 - yearBuilt) * -500; // Older homes worth less
    
    const estimatedValue = basePrice + bedroomValue + bathroomValue + ageValue;
    const variance = 0.1; // 10% variance
    
    // Empty comparables array - Coming Soon feature
    const comparables: ComparableProperty[] = [];
    
    return {
      estimatedValue,
      valueRange: {
        low: Math.floor(estimatedValue * (1 - variance)),
        high: Math.floor(estimatedValue * (1 + variance))
      },
      comparables
    };
  }, [squareFootage, bedrooms, bathrooms, yearBuilt]);

  // Calculate home estimate
  const calculateEstimate = useCallback(() => {
    if (!zipCode || zipCode.length < 5) {
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid ZIP code",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const result = generateComparables();
      setEstimateResult(result);
      setIsCalculating(false);
      
      toast({
        title: "Estimate Complete",
        description: "Your home value estimate has been calculated",
      });
    }, 1500);
  }, [zipCode, generateComparables, toast]);

  // Handle input changes
  const handleSquareFootageChange = (value: string) => {
    const sqft = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(sqft)) {
      setSquareFootage(sqft);
    }
  };

  const handleZipCodeChange = (value: string) => {
    // Only allow numbers and limit to 5 digits
    const zip = value.replace(/\D/g, '').slice(0, 5);
    setZipCode(zip);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b  pt-16">

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Home Value Estimator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get an estimate of your home's current market value based on recent comparable sales in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <Card className="col-span-1 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5" />
                  Property Details
                </CardTitle>
                <CardDescription>
                  Enter your property information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="squareFootage">Square Footage</Label>
                    <span className="text-sm font-medium">
                      {squareFootage.toLocaleString()} sq ft
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-4 w-4 text-gray-500" />
                    <Input
                      id="squareFootage"
                      type="text"
                      value={squareFootage.toLocaleString()}
                      onChange={(e) => handleSquareFootageChange(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <Slider
                    value={[squareFootage]}
                    min={500}
                    max={5000}
                    step={100}
                    onValueChange={(value) => setSquareFootage(value[0])}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select 
                      value={bedrooms.toString()} 
                      onValueChange={(value) => setBedrooms(parseInt(value))}
                    >
                      <SelectTrigger id="bedrooms">
                        <SelectValue placeholder="Bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select 
                      value={bathrooms.toString()} 
                      onValueChange={(value) => setBathrooms(parseFloat(value))}
                    >
                      <SelectTrigger id="bathrooms">
                        <SelectValue placeholder="Bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    min="1900"
                    max="2023"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(parseInt(e.target.value) || 1900)}
                    className="flex-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select 
                    value={propertyType} 
                    onValueChange={setPropertyType}
                  >
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-family">Single Family Home</SelectItem>
                      <SelectItem value="condo">Condo/Apartment</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="multi-family">Multi-Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <Input
                      id="zipCode"
                      type="text"
                      value={zipCode}
                      onChange={(e) => handleZipCodeChange(e.target.value)}
                      placeholder="Enter ZIP code"
                      className="flex-1"
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculateEstimate} 
                  className="w-full mt-4"
                  disabled={isCalculating || !zipCode || zipCode.length < 5}
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Estimate'}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="col-span-1 lg:col-span-2 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Home Value Estimate
                </CardTitle>
                <CardDescription>
                  Based on comparable properties in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                {estimateResult ? (
                  <div className="space-y-8">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Estimated Value</h3>
                      <p className="text-4xl font-bold text-blue-600 mb-2">
                        {formatCurrency(estimateResult.estimatedValue)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Estimated range: {formatCurrency(estimateResult.valueRange.low)} - {formatCurrency(estimateResult.valueRange.high)}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Comparable Properties</h3>
                      <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg">
                        <Clock className="h-12 w-12 text-blue-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Coming Soon</h3>
                        <p className="text-gray-500 max-w-md">
                          We're working on gathering comparable property data for your area. 
                          This feature will be available in a future update.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">About This Estimate</h3>
                      <p className="text-sm text-gray-600">
                        This home value estimate is based on recent comparable sales in your area and the property details you provided. 
                        The actual market value may vary based on other factors such as property condition, unique features, and current market trends.
                        For a more accurate valuation, consider consulting with a local real estate professional.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Home className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Estimate Yet</h3>
                    <p className="text-gray-500 max-w-md">
                      Fill out your property details and click "Calculate Estimate" to see your home's estimated value.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeEstimateCalculator;
