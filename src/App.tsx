import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Eagerly load auth page (needed immediately for login)
import AuthPage from "./pages/AuthPage";
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
              {/* Public routes */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/finance" element={<ProtectedRoute><FinancePage /></ProtectedRoute>} />
              <Route path="/investments" element={<ProtectedRoute><TradingPage /></ProtectedRoute>} />
              <Route path="/tech" element={<ProtectedRoute><TechPage /></ProtectedRoute>} />
              <Route path="/spiritual" element={<ProtectedRoute><SpiritualPage /></ProtectedRoute>} />
              <Route path="/music" element={<ProtectedRoute><MusicPage /></ProtectedRoute>} />
              <Route path="/content" element={<ProtectedRoute><ContentPage /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
              <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
              <Route path="/spiritual/library" element={<ProtectedRoute><CharacterLibraryPage /></ProtectedRoute>} />
              <Route path="/spiritual/character/:id" element={<ProtectedRoute><CharacterWorkspacePage /></ProtectedRoute>} />

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
