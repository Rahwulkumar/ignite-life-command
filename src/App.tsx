import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Eagerly load not found page
import NotFound from "./pages/NotFound";

// Lazy load all domain pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const TradingPage = lazy(() => import("./pages/TradingPage"));
const TechPage = lazy(() => import("./pages/TechPage"));
const SpiritualPage = lazy(() => import("./pages/SpiritualPage"));
const MusicPage = lazy(() => import("./pages/MusicPage"));
const ContentPage = lazy(() => import("./pages/ContentPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const CharacterLibraryPage = lazy(() => import("./pages/spiritual/CharacterLibraryPage"));
const CharacterWorkspacePage = lazy(() => import("./pages/spiritual/CharacterWorkspacePage"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/spiritual/library" element={<CharacterLibraryPage />} />
              <Route path="/spiritual/character/:id" element={<CharacterWorkspacePage />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
