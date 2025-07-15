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
import BusinessSubmission from "@/pages/business-submission";
import Admin from "@/pages/admin";
import Bookmarks from "@/pages/bookmarks";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/tutoring-providers" component={TutoringProviders} />
          <Route path="/summer-camps" component={SummerCamps} />
          <Route path="/internships" component={Internships} />
          <Route path="/jobs" component={Jobs} />
          <Route path="/submit-listing" component={BusinessSubmission} />
          <Route path="/bookmarks" component={Bookmarks} />
          <Route path="/admin" component={Admin} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
