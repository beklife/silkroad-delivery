import { Switch, Route, Router, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MusicProvider } from "@/lib/MusicContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import { CartProvider } from "@/lib/CartContext";
import GoogleReviewButton from "@/components/GoogleReviewButton";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MenuPage from "@/pages/MenuPage";
import Impressum from "@/pages/Impressum";
import Datenschutz from "@/pages/Datenschutz";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import AdminPage from "@/pages/AdminPage";

function RouteAwareGoogleReviewButton() {
  const [location] = useLocation();
  const isMenuPage = /^\/(?:en\/|ru\/)?menu\/?$/.test(location);
  const isAdmin = location.startsWith("/admin");
  if (isMenuPage || isAdmin) return null;
  return <GoogleReviewButton />;
}

// Wraps everything except /admin in MusicProvider so music never plays on admin
function RouteAwareMusicProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  if (location.startsWith("/admin")) return <>{children}</>;
  return <MusicProvider>{children}</MusicProvider>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <CartProvider>
            <Toaster />
            <Router base={import.meta.env.BASE_URL}>
              <RouteAwareMusicProvider>
                <RouteAwareGoogleReviewButton />
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

                  {/* Checkout */}
                  <Route path="/checkout" component={CheckoutPage} />
                  <Route path="/order-success/:id" component={OrderSuccessPage} />

                  {/* Admin */}
                  <Route path="/admin" component={AdminPage} />

                  {/* 404 */}
                  <Route component={NotFound} />
                </Switch>
              </RouteAwareMusicProvider>
            </Router>
          </CartProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
