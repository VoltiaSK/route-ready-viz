
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FleetVisualization from "./components/FleetVisualization";

const queryClient = new QueryClient();

// For direct embedding without routing
const EmbedVisualization = () => {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const dataUrl = urlParams.get('dataUrl');
  
  return <FleetVisualization jsonUrl={dataUrl || undefined} />;
};

const App = () => {
  // Check if we're being directly embedded
  const isEmbedMode = window.location.pathname === '/embed';
  
  if (isEmbedMode) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="p-4">
            <EmbedVisualization />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/embed" element={<EmbedVisualization />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
