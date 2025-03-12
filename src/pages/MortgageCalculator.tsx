import { useState, useEffect, useCallback } from 'react';
import { Calculator, DollarSign, Percent, Calendar, Home, Wrench, Truck, FileText, Users, Gift, Receipt, Landmark, ChevronDown, ChevronUp, HelpCircle, Hammer } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';

interface AmortizationEntry {
  payment: number;
  year: number;
  principal: number;
  interest: number;
  totalPayment: number;
  balance: number;
}

interface RepairCostItem {
  name: string;
  cost: number;
  category: 'interior' | 'exterior';
}

const MortgageCalculator = () => {
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTerm, setLoanTerm] = useState(10);
  const [downPayment, setDownPayment] = useState(10000);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationEntry[]>([]);
  
  // Home selling cost states
  const [sellingPrice, setSellingPrice] = useState(300000);
  const [remainingMortgage, setRemainingMortgage] = useState(200000);
  const [prepRepairCosts, setPrepRepairCosts] = useState(12000); // Initialize with sum of homeImprovementCosts + stagingCosts
  const [homeImprovementCosts, setHomeImprovementCosts] = useState(10000);
  const [stagingCosts, setStagingCosts] = useState(2000);
  const [closingCosts, setClosingCosts] = useState(0);
  const [agentCommission, setAgentCommission] = useState(18000); // Default 6% of selling price
  const [agentCommissionPercent, setAgentCommissionPercent] = useState(6);
  const [sellingConcessions, setSellingConcessions] = useState(3000);
  const [closingFees, setClosingFees] = useState(2500);
  const [taxes, setTaxes] = useState(5000);
  const [totalSellingCosts, setTotalSellingCosts] = useState(0);
  const [netProceeds, setNetProceeds] = useState(0);
  const [activeTab, setActiveTab] = useState("mortgage");
  const [isPrepCostsExpanded, setIsPrepCostsExpanded] = useState(false);
  const [isClosingCostsExpanded, setIsClosingCostsExpanded] = useState(false);

  // Rehab calculator states
  const [arv, setArv] = useState<number>(300000);
  const [repairCosts, setRepairCosts] = useState<RepairCostItem[]>([]);
  const [newRepairName, setNewRepairName] = useState<string>('');
  const [newRepairCost, setNewRepairCost] = useState<number>(0);
  const [newRepairCategory, setNewRepairCategory] = useState<'interior' | 'exterior'>('interior');
  const [totalInteriorCosts, setTotalInteriorCosts] = useState<number>(0);
  const [totalExteriorCosts, setTotalExteriorCosts] = useState<number>(0);
  const [totalRepairCosts, setTotalRepairCosts] = useState<number>(0);
  const [seventyPercentRule, setSeventyPercentRule] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(0);

  // Common repairs for rehab calculator
  const commonRepairs = {
    interior: [
      'Paint', 'Flooring', 'Kitchen', 'Appliances', 'Bathroom',
      'Framing', 'Insulation', 'Walls', 'Doors And Trim'
    ],
    exterior: [
      'Roof', 'Gutters', 'Siding', 'Masonry', 'Painting',
      'Windows', 'Garage', 'Landscaping', 'Concrete And Asphalt',
      'Wooden Amenities', 'Septic', 'Pool'
    ]
  };

  // Generate amortization schedule
  const generateAmortizationSchedule = useCallback((principal: number, monthlyRate: number, totalPayments: number, payment: number) => {
    let balance = principal;
    const schedule: AmortizationEntry[] = [];
    
    for (let i = 1; i <= Math.min(totalPayments, 360); i++) {
      const interest = balance * monthlyRate;
      const monthlyPrincipal = interestRate === 0 
        ? principal / totalPayments 
        : payment - interest;
      
      balance -= monthlyPrincipal;
      
      // Only store yearly entries to keep the schedule manageable
      if (i % 12 === 0 || i === 1 || i === totalPayments) {
        schedule.push({
          payment: i,
          year: Math.ceil(i / 12),
          principal: monthlyPrincipal,
          interest: interest,
          totalPayment: monthlyPrincipal + interest,
          balance: Math.max(0, balance),
        });
      }
    }
    
    setAmortizationSchedule(schedule);
  }, [interestRate]);

  // Calculate mortgage payment
  const calculateMortgage = useCallback(() => {
    // Convert annual interest rate to monthly and decimal form
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const principal = loanAmount - downPayment;

    if (principal <= 0) {
      toast({
        title: "Invalid input",
        description: "Loan amount must be greater than down payment",
        variant: "destructive",
      });
      return;
    }

    // Calculate monthly payment using the formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    // Where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
    if (interestRate === 0) {
      // Handle edge case of 0% interest
      const payment = principal / numberOfPayments;
      setMonthlyPayment(payment);
      setTotalPayment(payment * numberOfPayments);
      setTotalInterest(0);
      
      // Generate amortization schedule
      generateAmortizationSchedule(principal, monthlyInterestRate, numberOfPayments, payment);
    } else {
      const x = Math.pow(1 + monthlyInterestRate, numberOfPayments);
      const monthly = (principal * monthlyInterestRate * x) / (x - 1);
      setMonthlyPayment(monthly);
      setTotalPayment(monthly * numberOfPayments);
      setTotalInterest(monthly * numberOfPayments - principal);
      
      // Generate amortization schedule
      generateAmortizationSchedule(principal, monthlyInterestRate, numberOfPayments, monthly);
    }

    toast({
      title: "Calculation complete",
      description: "Your mortgage details have been calculated",
    });
  }, [loanAmount, interestRate, loanTerm, downPayment, toast, generateAmortizationSchedule]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage of selling price
  const formatPercentOfPrice = (value: number) => {
    return `${((value / sellingPrice) * 100).toFixed(1)}%`;
  };

  // Handle input changes
  const handleLoanAmountChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setLoanAmount(amount);
    }
  };

  const handleDownPaymentChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setDownPayment(amount);
    }
  };

  const handleLoanTermChange = (value: number) => {
    // Ensure the loan term is between 1 and 50 years
    const term = Math.min(Math.max(1, value), 50);
    setLoanTerm(term);
  };

  // Handle selling cost input changes
  const handleSellingPriceChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setSellingPrice(amount);
    }
  };

  const handleRemainingMortgageChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setRemainingMortgage(amount);
    }
  };

  // Calculate prep & repair costs based on home improvement and staging costs
  const calculatePrepRepairCosts = useCallback(() => {
    const total = homeImprovementCosts + stagingCosts;
    setPrepRepairCosts(total);
    return total;
  }, [homeImprovementCosts, stagingCosts]);

  const handleHomeImprovementCostsChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setHomeImprovementCosts(amount);
    }
  };

  const handleStagingCostsChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setStagingCosts(amount);
    }
  };

  const handleClosingCostsChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setClosingCosts(amount);
    }
  };

  const handleAgentCommissionPercentChange = (value: number) => {
    setAgentCommissionPercent(value);
    const commission = (value / 100) * sellingPrice;
    setAgentCommission(commission);
  };

  const handleAgentCommissionChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setAgentCommission(amount);
      // Update percentage based on the commission amount
      const percent = (amount / sellingPrice) * 100;
      setAgentCommissionPercent(parseFloat(percent.toFixed(2)));
    }
  };

  const handleSellingConcessionsChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setSellingConcessions(amount);
    }
  };

  const handleClosingFeesChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setClosingFees(amount);
    }
  };

  const handleTaxesChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setTaxes(amount);
    }
  };

  // Rehab calculator functions
  const addRepair = () => {
    if (newRepairName && newRepairCost > 0) {
      setRepairCosts([...repairCosts, {
        name: newRepairName,
        cost: newRepairCost,
        category: newRepairCategory
      }]);
      setNewRepairName('');
      setNewRepairCost(0);
      
      toast({
        title: "Repair added",
        description: `${newRepairName} added to ${newRepairCategory} repairs`,
      });
    } else {
      toast({
        title: "Invalid input",
        description: "Please enter a repair name and a cost greater than 0",
        variant: "destructive",
      });
    }
  };

  const removeRepair = (index: number) => {
    const updatedRepairs = [...repairCosts];
    updatedRepairs.splice(index, 1);
    setRepairCosts(updatedRepairs);
    
    toast({
      title: "Repair removed",
      description: "Repair item has been removed from the list",
    });
  };

  const handleArvChange = (value: string) => {
    const amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(amount)) {
      setArv(amount);
    }
  };

  const calculateRehabMetrics = useCallback(() => {
    // Calculate totals
    const interiorCosts = repairCosts
      .filter(item => item.category === 'interior')
      .reduce((sum, item) => sum + item.cost, 0);
    
    const exteriorCosts = repairCosts
      .filter(item => item.category === 'exterior')
      .reduce((sum, item) => sum + item.cost, 0);
    
    const totalCosts = interiorCosts + exteriorCosts;
    
    setTotalInteriorCosts(interiorCosts);
    setTotalExteriorCosts(exteriorCosts);
    setTotalRepairCosts(totalCosts);
    setSeventyPercentRule((arv * 0.7) - totalCosts);
    setProfitMargin(arv - totalCosts);

    toast({
      title: "Calculation complete",
      description: "Your rehab calculations have been updated",
    });
  }, [arv, repairCosts, toast]);

  // Calculate selling costs
  const calculateSellingCosts = useCallback(() => {
    // Update agent commission when selling price changes
    const commission = (agentCommissionPercent / 100) * sellingPrice;
    setAgentCommission(commission);
    
    // Calculate total closing costs (sum of agent commission, selling concessions, closing fees, and taxes)
    const totalClosingCosts = agentCommission + sellingConcessions + closingFees + taxes;
    setClosingCosts(totalClosingCosts);
    
    // Calculate prep & repair costs
    const totalPrepCosts = calculatePrepRepairCosts();
    
    const totalCosts = totalPrepCosts + totalClosingCosts;
    setTotalSellingCosts(totalCosts);
    
    const proceeds = sellingPrice - remainingMortgage - totalCosts;
    setNetProceeds(proceeds);

    toast({
      title: "Calculation complete",
      description: "Your home selling costs have been calculated",
    });
  }, [sellingPrice, remainingMortgage, agentCommission, agentCommissionPercent, 
      sellingConcessions, closingFees, taxes, toast, calculatePrepRepairCosts]);

  // Calculate on mount and when inputs change
  useEffect(() => {
    calculateMortgage();
  }, [calculateMortgage]);

  useEffect(() => {
    calculatePrepRepairCosts();
  }, [homeImprovementCosts, stagingCosts, calculatePrepRepairCosts]);

  useEffect(() => {
    calculateSellingCosts();
  }, [calculateSellingCosts]);

  useEffect(() => {
    calculateRehabMetrics();
  }, [calculateRehabMetrics]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mortgage & Home Calculators
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plan your home purchase, sale, and renovation with our easy-to-use calculators. 
              Adjust the parameters to see how they affect your finances.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mortgage">Mortgage Calculator</TabsTrigger>
              <TabsTrigger value="selling">Home Selling Calculator</TabsTrigger>
              <TabsTrigger value="rehab">Rehab Calculator</TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "mortgage" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Mortgage Input Section */}
              <Card className="col-span-1 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="mr-2 h-5 w-5" />
                    Mortgage Details
                  </CardTitle>
                  <CardDescription>
                    Enter your mortgage information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="loanAmount">Home Price</Label>
                      <span className="text-sm font-medium">
                        {formatCurrency(loanAmount)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <Input
                        id="loanAmount"
                        type="text"
                        value={formatCurrency(loanAmount)}
                        onChange={(e) => handleLoanAmountChange(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <Slider
                      value={[loanAmount]}
                      min={10000}
                      max={1000000}
                      step={5000}
                      onValueChange={(value) => setLoanAmount(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="downPayment">Down Payment</Label>
                      <span className="text-sm font-medium">
                        {formatCurrency(downPayment)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <Input
                        id="downPayment"
                        type="text"
                        value={formatCurrency(downPayment)}
                        onChange={(e) => handleDownPaymentChange(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <Slider
                      value={[downPayment]}
                      min={0}
                      max={loanAmount}
                      step={5000}
                      onValueChange={(value) => setDownPayment(value[0])}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-500 text-right">
                      {((downPayment / loanAmount) * 100).toFixed(1)}% of home price
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="interestRate">Interest Rate</Label>
                      <span className="text-sm font-medium">
                        {interestRate.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4 text-gray-500" />
                      <Input
                        id="interestRate"
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                        step="0.1"
                        min="0"
                        max="15"
                        className="flex-1"
                      />
                    </div>
                    <Slider
                      value={[interestRate]}
                      min={0}
                      max={10}
                      step={0.1}
                      onValueChange={(value) => setInterestRate(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="loanTerm">Loan Term</Label>
                      <span className="text-sm font-medium">
                        {loanTerm} {loanTerm === 1 ? 'year' : 'years'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <Input
                        id="loanTerm"
                        type="number"
                        min="1"
                        max="50"
                        value={loanTerm}
                        onChange={(e) => handleLoanTermChange(parseInt(e.target.value) || 10)}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 px-1">
                      <span>1 year</span>
                      <span>50 years (max)</span>
                    </div>
                    <Slider
                      value={[loanTerm]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => setLoanTerm(value[0])}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={calculateMortgage}
                  >
                    Calculate
                  </Button>
                </CardFooter>
              </Card>

              {/* Mortgage Results Section */}
              <Card className="col-span-1 lg:col-span-2 shadow-md">
                <CardHeader>
                  <CardTitle>Mortgage Summary</CardTitle>
                  <CardDescription>
                    Based on your inputs, here's your mortgage breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="schedule">Amortization</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="summary" className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Payment</h3>
                          <p className="text-2xl font-bold text-blue-700">{formatCurrency(monthlyPayment)}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Loan Amount</h3>
                          <p className="text-2xl font-bold text-green-700">{formatCurrency(loanAmount - downPayment)}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Interest</h3>
                          <p className="text-2xl font-bold text-purple-700">{formatCurrency(totalInterest)}</p>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">Payment Breakdown</h3>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                                Principal
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-200 text-purple-800">
                                Interest
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-gray-200">
                            <div
                              style={{
                                width: `${(1 - totalInterest / totalPayment) * 100}%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            >
                              {((1 - totalInterest / totalPayment) * 100).toFixed(1)}%
                            </div>
                            <div
                              style={{
                                width: `${(totalInterest / totalPayment) * 100}%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                            >
                              {((totalInterest / totalPayment) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-lg mt-6">
                        <h3 className="text-lg font-medium mb-4">Loan Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Home Price:</span>
                            <span className="font-medium">{formatCurrency(loanAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Down Payment:</span>
                            <span className="font-medium">{formatCurrency(downPayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Loan Amount:</span>
                            <span className="font-medium">{formatCurrency(loanAmount - downPayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Interest Rate:</span>
                            <span className="font-medium">{interestRate.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Loan Term:</span>
                            <span className="font-medium">{loanTerm} {loanTerm === 1 ? 'year' : 'years'}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Monthly Payment:</span>
                              <span className="font-medium">{formatCurrency(monthlyPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total of {loanTerm * 12} Payments:</span>
                              <span className="font-medium">{formatCurrency(totalPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Interest Paid:</span>
                              <span className="font-medium">{formatCurrency(totalInterest)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="schedule" className="pt-6">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Year
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Principal
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Interest
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Balance
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {amortizationSchedule.map((entry, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {entry.year}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {entry.payment}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency(entry.principal)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency(entry.interest)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency(entry.balance)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Note: This is a simplified amortization schedule showing yearly snapshots.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : activeTab === "selling" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Home Selling Input Section */}
              <Card className="col-span-1 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="mr-2 h-5 w-5" />
                    Home Selling Details
                  </CardTitle>
                  <CardDescription>
                    Enter your home selling information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold">Estimated net proceeds</h3>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(netProceeds)}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sellingPrice">Est. selling price of your home</Label>
                      <span className="text-sm font-medium">
                        {formatCurrency(sellingPrice)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <Input
                        id="sellingPrice"
                        type="text"
                        value={formatCurrency(sellingPrice)}
                        onChange={(e) => handleSellingPriceChange(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <Slider
                      value={[sellingPrice]}
                      min={100000}
                      max={2000000}
                      step={10000}
                      onValueChange={(value) => setSellingPrice(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Label htmlFor="remainingMortgage">Est. remaining mortgage</Label>
                        <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(remainingMortgage)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4 text-gray-500" />
                      <Input
                        id="remainingMortgage"
                        type="text"
                        value={formatCurrency(remainingMortgage)}
                        onChange={(e) => handleRemainingMortgageChange(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <Slider
                      value={[remainingMortgage]}
                      min={0}
                      max={sellingPrice}
                      step={10000}
                      onValueChange={(value) => setRemainingMortgage(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setIsPrepCostsExpanded(!isPrepCostsExpanded)}
                    >
                      <div className="flex items-center">
                        <Label htmlFor="prepRepairCosts">Est. prep & repair costs</Label>
                        <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          {formatCurrency(prepRepairCosts)}
                        </span>
                        {isPrepCostsExpanded ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </div>
                    </div>
                    
                    {isPrepCostsExpanded && (
                      <div className="bg-blue-50 p-4 rounded-md space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Label htmlFor="homeImprovementCosts">Home improvement</Label>
                              <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <Input
                              id="homeImprovementCosts"
                              type="text"
                              value={formatCurrency(homeImprovementCosts)}
                              onChange={(e) => handleHomeImprovementCostsChange(e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Label htmlFor="stagingCosts">Staging and landscaping</Label>
                              <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <Input
                              id="stagingCosts"
                              type="text"
                              value={formatCurrency(stagingCosts)}
                              onChange={(e) => handleStagingCostsChange(e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setIsClosingCostsExpanded(!isClosingCostsExpanded)}
                    >
                      <div className="flex items-center">
                        <Label htmlFor="closingCosts">Est. closing costs</Label>
                        <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          {formatCurrency(closingCosts)}
                        </span>
                        {isClosingCostsExpanded ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </div>
                    </div>
                    
                    {isClosingCostsExpanded && (
                      <div className="bg-blue-50 p-4 rounded-md space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Label htmlFor="agentCommission">Agent commission</Label>
                              <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <Input
                              id="agentCommission"
                              type="text"
                              value={formatCurrency(agentCommission)}
                              onChange={(e) => handleAgentCommissionChange(e.target.value)}
                              className="flex-1"
                            />
                            <div className="w-24">
                              <Input
                                type="number"
                                value={agentCommissionPercent}
                                onChange={(e) => handleAgentCommissionPercentChange(parseFloat(e.target.value))}
                                className="text-right"
                                min="0"
                                max="10"
                                step="0.1"
                              />
                            </div>
                            <span className="text-sm">%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Label htmlFor="sellingConcessions">Selling concessions</Label>
                              <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <Input
                              id="sellingConcessions"
                              type="text"
                              value={formatCurrency(sellingConcessions)}
                              onChange={(e) => handleSellingConcessionsChange(e.target.value)}
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-500 w-12 text-right">
                              {formatPercentOfPrice(sellingConcessions)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Label htmlFor="closingFees">Closing fees</Label>
                              <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <Input
                              id="closingFees"
                              type="text"
                              value={formatCurrency(closingFees)}
                              onChange={(e) => handleClosingFeesChange(e.target.value)}
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-500 w-12 text-right">
                              {formatPercentOfPrice(closingFees)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Label htmlFor="taxes">Taxes</Label>
                              <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <Input
                              id="taxes"
                              type="text"
                              value={formatCurrency(taxes)}
                              onChange={(e) => handleTaxesChange(e.target.value)}
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-500 w-12 text-right">
                              {formatPercentOfPrice(taxes)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <Label>Est. total selling costs ({((totalSellingCosts / sellingPrice) * 100).toFixed(0)}%)</Label>
                      <span className="text-lg font-bold">
                        {formatCurrency(totalSellingCosts)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      All calculations are estimates and provided for informational purposes only. Actual amounts may vary.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={calculateSellingCosts}
                  >
                    Calculate
                  </Button>
                </CardFooter>
              </Card>

              {/* Home Selling Results Section */}
              <Card className="col-span-1 lg:col-span-2 shadow-md">
                <CardHeader>
                  <CardTitle>Home Selling Summary</CardTitle>
                  <CardDescription>
                    Based on your inputs, here's your home selling breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Selling Price</h3>
                        <p className="text-2xl font-bold text-blue-700">{formatCurrency(sellingPrice)}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Costs</h3>
                        <p className="text-2xl font-bold text-red-700">{formatCurrency(totalSellingCosts + remainingMortgage)}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Net Proceeds</h3>
                        <p className="text-2xl font-bold text-green-700">{formatCurrency(netProceeds)}</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Cost Breakdown</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                          <span className="text-xs">Mortgage</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-pink-500 mr-1"></div>
                          <span className="text-xs">Agent Commission</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                          <span className="text-xs">Home Improvement</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                          <span className="text-xs">Staging</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                          <span className="text-xs">Closing Costs</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></div>
                          <span className="text-xs">Other Costs</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                          <span className="text-xs">Net Proceeds</span>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-gray-200">
                          <div
                            style={{
                              width: `${(remainingMortgage / sellingPrice) * 100}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                          >
                            Mortgage
                          </div>
                          <div
                            style={{
                              width: `${(agentCommission / sellingPrice) * 100}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
                          >
                            Agent
                          </div>
                          <div
                            style={{
                              width: `${(homeImprovementCosts / sellingPrice) * 100}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                          >
                            Improve
                          </div>
                          <div
                            style={{
                              width: `${(stagingCosts / sellingPrice) * 100}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                          >
                            Staging
                          </div>
                          <div
                            style={{
                              width: `${((closingCosts + closingFees) / sellingPrice) * 100}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          >
                            Closing
                          </div>
                          <div
                            style={{
                              width: `${((sellingConcessions + taxes) / sellingPrice) * 100}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                          >
                            Other
                          </div>
                          <div
                            style={{
                              width: `${(netProceeds / sellingPrice) * 100}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          >
                            Proceeds
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg mt-6">
                      <h3 className="text-lg font-medium mb-4">Home Selling Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated Selling Price:</span>
                          <span className="font-medium">{formatCurrency(sellingPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Remaining Mortgage:</span>
                          <span className="font-medium">{formatCurrency(remainingMortgage)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Agent Commission ({agentCommissionPercent}%):</span>
                            <span className="font-medium">{formatCurrency(agentCommission)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Home Improvement Costs:</span>
                            <span className="font-medium">{formatCurrency(homeImprovementCosts)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Staging & Landscaping:</span>
                            <span className="font-medium">{formatCurrency(stagingCosts)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Closing Costs:</span>
                            <span className="font-medium">{formatCurrency(closingCosts)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Selling Concessions:</span>
                            <span className="font-medium">{formatCurrency(sellingConcessions)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Closing Fees:</span>
                            <span className="font-medium">{formatCurrency(closingFees)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Taxes:</span>
                            <span className="font-medium">{formatCurrency(taxes)}</span>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Selling Costs:</span>
                            <span className="font-medium">{formatCurrency(totalSellingCosts)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Costs (incl. Mortgage):</span>
                            <span className="font-medium">{formatCurrency(totalSellingCosts + remainingMortgage)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-green-700">
                            <span>Estimated Net Proceeds:</span>
                            <span>{formatCurrency(netProceeds)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rehab Calculator Input Section */}
              <Card className="col-span-1 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Hammer className="mr-2 h-5 w-5" />
                    Rehab Details
                  </CardTitle>
                  <CardDescription>
                    Enter your rehab project information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold">70% Rule Max Purchase</h3>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(seventyPercentRule)}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="arv">After Repair Value (ARV)</Label>
                      <span className="text-sm font-medium">
                        {formatCurrency(arv)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <Input
                        id="arv"
                        type="text"
                        value={formatCurrency(arv)}
                        onChange={(e) => handleArvChange(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <Slider
                      value={[arv]}
                      min={100000}
                      max={2000000}
                      step={10000}
                      onValueChange={(value) => setArv(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Add Repair Cost</Label>
                    <div className="flex items-center space-x-2 mb-2">
                      <select
                        value={newRepairCategory}
                        onChange={(e) => setNewRepairCategory(e.target.value as 'interior' | 'exterior')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="interior">Interior</option>
                        <option value="exterior">Exterior</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <Input
                        type="text"
                        value={newRepairName}
                        onChange={(e) => setNewRepairName(e.target.value)}
                        placeholder="Repair name"
                        list="common-repairs"
                        className="flex-1"
                      />
                      <datalist id="common-repairs">
                        {newRepairCategory === 'interior' 
                          ? commonRepairs.interior.map(repair => (
                              <option key={repair} value={repair} />
                            ))
                          : commonRepairs.exterior.map(repair => (
                              <option key={repair} value={repair} />
                            ))
                        }
                      </datalist>
                    </div>

                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <Input
                        type="number"
                        value={newRepairCost || ''}
                        onChange={(e) => setNewRepairCost(Number(e.target.value))}
                        placeholder="Cost"
                        className="flex-1"
                      />
                      <Button onClick={addRepair} size="sm">
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <Label>Total Repair Costs</Label>
                      <span className="text-lg font-bold">
                        {formatCurrency(totalRepairCosts)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      All calculations are estimates and provided for informational purposes only. Actual costs may vary.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={calculateRehabMetrics}
                  >
                    Calculate
                  </Button>
                </CardFooter>
              </Card>

              {/* Rehab Calculator Results Section */}
              <Card className="col-span-1 lg:col-span-2 shadow-md">
                <CardHeader>
                  <CardTitle>Rehab Summary</CardTitle>
                  <CardDescription>
                    Based on your inputs, here's your rehab project breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">After Repair Value</h3>
                        <p className="text-2xl font-bold text-blue-700">{formatCurrency(arv)}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Repair Costs</h3>
                        <p className="text-2xl font-bold text-red-700">{formatCurrency(totalRepairCosts)}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">70% Rule Max Purchase</h3>
                        <p className="text-2xl font-bold text-green-700">{formatCurrency(seventyPercentRule)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Interior Repairs</h3>
                        {repairCosts.filter(item => item.category === 'interior').length > 0 ? (
                          <div className="space-y-2">
                            {repairCosts
                              .filter(item => item.category === 'interior')
                              .map((item, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                  <span>{item.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{formatCurrency(item.cost)}</span>
                                    <button 
                                      onClick={() => removeRepair(repairCosts.indexOf(item))}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              ))}
                            <div className="flex justify-between font-medium pt-2">
                              <span>Total Interior:</span>
                              <span>{formatCurrency(totalInteriorCosts)}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No interior repairs added yet</p>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Exterior Repairs</h3>
                        {repairCosts.filter(item => item.category === 'exterior').length > 0 ? (
                          <div className="space-y-2">
                            {repairCosts
                              .filter(item => item.category === 'exterior')
                              .map((item, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                  <span>{item.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{formatCurrency(item.cost)}</span>
                                    <button 
                                      onClick={() => removeRepair(repairCosts.indexOf(item))}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              ))}
                            <div className="flex justify-between font-medium pt-2">
                              <span>Total Exterior:</span>
                              <span>{formatCurrency(totalExteriorCosts)}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No exterior repairs added yet</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg mt-6">
                      <h3 className="text-lg font-medium mb-4">Investment Calculations</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">After Repair Value (ARV):</span>
                          <span className="font-medium">{formatCurrency(arv)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Repair Costs:</span>
                          <span className="font-medium">{formatCurrency(totalRepairCosts)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">70% Rule Maximum Purchase Price:</span>
                            <span className="font-medium">{formatCurrency(seventyPercentRule)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Potential Profit Margin (ARV - Repairs):</span>
                            <span className="font-medium">{formatCurrency(profitMargin)}</span>
                          </div>
                        </div>
                        <div className="pt-4 text-sm text-gray-500">
                          <p><strong>70% Rule:</strong> A rule of thumb used by real estate investors that suggests the maximum purchase price for a property should be 70% of its After Repair Value (ARV) minus repair costs.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MortgageCalculator;
