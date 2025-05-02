import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// Static pages must come first
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Features from "./pages/Features";
import EssentialCheckout from "./pages/EssentialCheckout";
import PremiumCheckout from "./pages/PremiumCheckout";

// 🧠 Context Providers
import { AuthProvider } from "./context/AuthContext";
import { TourProvider } from "./context/TourContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import { PushProvider } from "./context/PushContext";

// 🧭 Navigation & Access
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/common/LoadingSpinner";

// 🧩 External styles
import "leaflet/dist/leaflet.css";

// 🧹 Lazy-loaded Pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login/LoginPage"));
const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const CreateCampaignPage = lazy(() =>
  import("./pages/CreateCampaign/CreateCampaignPage")
);
const PublicLinkPage = lazy(() => import("./pages/PublicLink/PublicLinkPage"));
const AnalyticsPage = lazy(() => import("./pages/Analytics/AnalyticsPage"));
const CampaignDetailPage = lazy(() =>
  import("./pages/CampaignDetails/CampaignDetailsPage")
);
const AdminEmails = lazy(() => import("./pages/AdminEmails"));
const SettingsPage = lazy(() => import("./pages/Settings/SettingsPage"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const PaymentVerify = lazy(() => import("./pages/PaymentVerify"));
const SubscriptionPlans = lazy(() => import("./pages/SubscriptionPlans"));
const PaymentCheckout = lazy(() => import("./pages/PaymentCheckout"));
const AuditTrail = lazy(() => import("./pages/AuditTrail"));
const CampaignsPage = lazy(() => import("./pages/CampaignsPage"));
const LeadsPage = lazy(() => import("./pages/LeadsPage"));

// 🛠 Setup React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 60 * 24,
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

// 🛠 Setup persister using localStorage
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

// 🛠 Persist the query client cache
persistQueryClient({
  queryClient,
  persister,
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <TourProvider>
          <Toaster position="top-right" />
          <GoogleOAuthProvider
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          >
            <AuthProvider>
              <PushProvider>
                <WorkspaceProvider>
                  <Router>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <main className="flex-grow">
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<LandingPage />} />
                          {/* <Route path="/login" element={<Login />} /> */}

                          <Route
                            path="/unauthorized"
                            element={<Unauthorized />}
                          />
                          <Route
                            path="/payment/verify"
                            element={<PaymentVerify />}
                          />
                          <Route
                            path="/price"
                            element={<SubscriptionPlans />}
                          />
                          {/* <Route path="/checkout" element={<PaymentCheckout />} /> */}
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/careers" element={<Careers />} />
                          <Route path="/features" element={<Features />} />
                          <Route
                            path="/essential-checkout"
                            element={<EssentialCheckout />}
                          />
                          <Route
                            path="/payment-checkout"
                            element={<PremiumCheckout />}
                          />

                          {/* Protected Routes */}
                          <Route
                            path="/dashboard"
                            element={
                              <ProtectedRoute>
                                <DashboardPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/create"
                            element={
                              <ProtectedRoute>
                                <CreateCampaignPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/create/:type"
                            element={
                              <ProtectedRoute>
                                <CreateCampaignPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/analytics"
                            element={
                              <ProtectedRoute>
                                <AnalyticsPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/analytics/:slug"
                            element={
                              <ProtectedRoute>
                                <CampaignDetailPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin/emails"
                            element={
                              <ProtectedRoute>
                                <AdminEmails />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/settings"
                            element={
                              <ProtectedRoute>
                                <SettingsPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/audit"
                            element={
                              <ProtectedRoute>
                                <AuditTrail />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/campaigns"
                            element={
                              <ProtectedRoute>
                                <CampaignsPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/leads"
                            element={
                              <ProtectedRoute>
                                <LeadsPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/:slug" element={<PublicLinkPage />} />
                          <Route path="/analytics/detail/:slug" element={<CampaignDetailPage />} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  </Router>
                </WorkspaceProvider>
              </PushProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </TourProvider>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
