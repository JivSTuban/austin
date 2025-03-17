import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Chatbot from "@/components/Chatbot";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/lib/AuthContext";
import AuthCallback from "./pages/AuthCallback";
import Index from "./pages/Index";
import Reviews from "./pages/Reviews";
import Forum from "./pages/Forum";
import Maps from "./pages/Maps";
import NotFound from "./pages/NotFound";
import MortgageCalculator from "./pages/MortgageCalculator";
import BackgroundShapes from "./components/BackgroundShapes";
import InvestorPackage from "./pages/InvestorPackage";
import Login from "./pages/Login";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ThreadView from "./pages/ThreadView";
import UsernamePage from "./pages/UsernamePage"; // Import UsernamePage
import SoldProperties from "./pages/SoldProperties"; // Import SoldProperties
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

// AppContent component to use router hooks
const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/username";
  
  return (
    <AuthProvider>
      <TooltipProvider>
        {showNavbar && <Navbar />}
        <Toaster />
        <Sonner
          position="bottom-left"
          theme="dark"
          closeButton
        />
        <BackgroundShapes />
        <Chatbot />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/investor-package" element={<InvestorPackage />} />
          <Route path="/calculators" element={<MortgageCalculator />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/thread/:threadId" element={<ThreadView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/auth/callback/*" element={<AuthCallback />} />
          <Route path="/username" element={<UsernamePage />} />
          <Route path="/sold-properties" element={<SoldProperties />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </TooltipProvider>
    </AuthProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
