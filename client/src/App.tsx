import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import TutoringProviders from "@/pages/tutoring-providers";
import SummerCamps from "@/pages/summer-camps";
import Internships from "@/pages/internships";
import Jobs from "@/pages/jobs";
import Events from "@/pages/events";
import Guides from "@/pages/guides";
import BusinessSubmission from "@/pages/business-submission";
import Admin from "@/pages/admin";
import Settings from "@/pages/settings";
import TermsOfUse from "./pages/terms-of-use";
import PrivacyPolicy from "./pages/privacy-policy";
import LearnMore from "./pages/learn-more";
import Bookmarks from "@/pages/bookmarks";

import Footer from "@/components/layout/footer";
import { useEffect } from "react";

function Router() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/terms-of-use" component={TermsOfUse} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/learn-more" component={LearnMore} />
      {!isAuthenticated ? (
        <Switch>
          <Route path="/" component={Landing} />
          <Route component={NotFound} />
        </Switch>
      ) : (
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/tutoring-providers" component={TutoringProviders} />
              <Route path="/summer-camps" component={SummerCamps} />
              <Route path="/internships" component={Internships} />
              <Route path="/jobs" component={Jobs} />
              <Route path="/events" component={Events} />
              {isAdmin && <Route path="/guides" component={Guides} />}
              <Route path="/submit-listing" component={BusinessSubmission} />
              <Route path="/bookmarks" component={Bookmarks} />
              <Route path="/settings" component={Settings} />
              <Route path="/admin" component={Admin} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Footer />
        </div>
      )}
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Prevent keyboard shortcuts for copy/cut/select all
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 'c' || e.key === 'x' || e.key === 'a' || e.key === 'u')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;