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
import Services from "@/pages/services";
import Events from "@/pages/events";
import Guides from "@/pages/guides";
import BusinessSubmission from "@/pages/business-submission";
import Admin from "@/pages/admin";
import Settings from "@/pages/settings";
import TermsOfUse from "./pages/terms-of-use";
import PrivacyPolicy from "./pages/privacy-policy";
import LearnMore from "./pages/learn-more";
import Bookmarks from "@/pages/bookmarks";
import ComingSoon from "@/pages/coming-soon";

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

  // Public routes available to all users (both authenticated and unauthenticated)
  // Landing page has its own footer, so render it outside the footer wrapper
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/terms-of-use" component={TermsOfUse} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/learn-more" component={LearnMore} />
        <Route path="/landing" component={Landing} />
        <Route path="/" component={Landing} />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            <Switch>
              {/* Public browsing pages - available to everyone */}
              <Route path="/home" component={Home} />
              <Route path="/tutoring-providers" component={TutoringProviders} />
              <Route path="/services" component={Services} />
              <Route path="/summer-camps" component={SummerCamps} />
              <Route path="/internships" component={Internships} />
              <Route path="/jobs" component={Jobs} />
              <Route path="/events" component={Events} />
              <Route path="/guides" component={Guides} />
              <Route path="/coming-soon" component={ComingSoon} />
              <Route path="/submit-listing" component={RedirectToLogin} />
              <Route path="/bookmarks" component={RedirectToLogin} />
              <Route path="/settings" component={RedirectToLogin} />
              <Route path="/admin" component={RedirectToLogin} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/terms-of-use" component={TermsOfUse} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/learn-more" component={LearnMore} />
      <Route path="/landing" component={Landing} />
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Switch>
            {/* Authenticated user pages */}
            <Route path="/" component={Home} />
            <Route path="/tutoring-providers" component={TutoringProviders} />
            <Route path="/services" component={Services} />
            <Route path="/summer-camps" component={SummerCamps} />
            <Route path="/internships" component={Internships} />
            <Route path="/jobs" component={Jobs} />
            <Route path="/events" component={Events} />
            <Route path="/guides" component={Guides} />
            <Route path="/coming-soon" component={ComingSoon} />
            {/* Protected pages - user is already authenticated */}
            <Route path="/submit-listing" component={BusinessSubmission} />
            <Route path="/bookmarks" component={Bookmarks} />
            <Route path="/settings" component={Settings} />
            <Route path="/admin" component={Admin} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Switch>
  );
}

function RedirectToLogin() {
  useEffect(() => {
    window.location.href = "/api/login";
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting to login...</p>
      </div>
    </div>
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
        (e.key === "c" || e.key === "x" || e.key === "a" || e.key === "u")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
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
