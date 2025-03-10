import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Chatbot from "@/components/Chatbot";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Reviews from "./pages/Reviews";
import Forum from "./pages/Forum";
import Maps from "./pages/Maps";
import NotFound from "./pages/NotFound";
import MortgageCalculator from "./pages/MortgageCalculator";
import HomeEstimateCalculator from "./pages/HomeEstimateCalculator";
import { pageTransition } from "./lib/animations";
import BackgroundShapes from "./components/BackgroundShapes";

// Apply page transition to route components
const TransitionedIndex = pageTransition(Index);
const TransitionedReviews = pageTransition(Reviews);
const TransitionedForum = pageTransition(Forum);
const TransitionedMaps = pageTransition(Maps);
const TransitionedNotFound = pageTransition(NotFound);
const TransitionedMortgageCalculator = pageTransition(MortgageCalculator);
const TransitionedHomeEstimateCalculator = pageTransition(HomeEstimateCalculator);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BackgroundShapes />
      <Chatbot />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TransitionedIndex />} />
          <Route path="/reviews" element={<TransitionedReviews />} />
          <Route path="/forum" element={<TransitionedForum />} />
          <Route path="/maps" element={<TransitionedMaps />} />
          <Route path="/calculators" element={<TransitionedMortgageCalculator />} />
          <Route path="/home-estimate" element={<TransitionedHomeEstimateCalculator />} />
          <Route path="/forum/thread/:threadId" element={<TransitionedForum />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<TransitionedNotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
