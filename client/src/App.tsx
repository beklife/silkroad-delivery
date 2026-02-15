import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MusicProvider } from "@/lib/MusicContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import GoogleReviewButton from "@/components/GoogleReviewButton";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MenuPage from "@/pages/MenuPage";
import Impressum from "@/pages/Impressum";
import Datenschutz from "@/pages/Datenschutz";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MusicProvider>
          <LanguageProvider>
            <Toaster />
            <GoogleReviewButton />
            <Router base={import.meta.env.BASE_URL}>
              <Switch>
                {/* German routes (default, no language prefix) */}
                <Route path="/" component={Home} />
                <Route path="/menu" component={MenuPage} />
                <Route path="/menu/" component={MenuPage} />
                <Route path="/impressum" component={Impressum} />
                <Route path="/impressum/" component={Impressum} />
                <Route path="/datenschutz" component={Datenschutz} />
                <Route path="/datenschutz/" component={Datenschutz} />

                {/* English routes */}
                <Route path="/en" component={Home} />
                <Route path="/en/" component={Home} />
                <Route path="/en/menu" component={MenuPage} />
                <Route path="/en/menu/" component={MenuPage} />

                {/* Russian routes */}
                <Route path="/ru" component={Home} />
                <Route path="/ru/" component={Home} />
                <Route path="/ru/menu" component={MenuPage} />
                <Route path="/ru/menu/" component={MenuPage} />

                {/* 404 */}
                <Route component={NotFound} />
              </Switch>
            </Router>
          </LanguageProvider>
        </MusicProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
