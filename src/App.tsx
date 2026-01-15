import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import FinancePage from "./pages/FinancePage";
import TradingPage from "./pages/TradingPage";
import TechPage from "./pages/TechPage";
import SpiritualPage from "./pages/SpiritualPage";
import MusicPage from "./pages/MusicPage";
import ContentPage from "./pages/ContentPage";
import ProjectsPage from "./pages/ProjectsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/investments" element={<TradingPage />} />
          <Route path="/tech" element={<TechPage />} />
          <Route path="/spiritual" element={<SpiritualPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
