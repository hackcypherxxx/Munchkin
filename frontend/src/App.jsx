import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';

// COMPONENTS
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';

// PAGES
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AvailableKittens from './pages/AvailableKittens';
import PricingDeposit from './pages/PricingDeposit';
import RetiredAdults from './pages/RetiredAdults';
import ShippingDelivery from './pages/ShippingDelivery';
import HealthGuarantee from './pages/HealthGuarantee';
import CareGuide from './pages/CareGuide';
import VettingProcess from './pages/VettingProcess';
import ContactUs from './pages/ContactUs';
import ReviewsPage from './pages/ReviewsPage';
import AboutBreeder from './pages/AboutBreeder';
import UpcomingLitters from './pages/UpcomingLitters';
import PolicyPage from './pages/PolicyPage';
import KittenDetail from './pages/KittenDetail';
import AdoptionApplication from './pages/AdoptionApplication';

// ADMIN
import AdminDashboard from './pages/AdminDashboard';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[#faf8f5] text-[#181615]">
    <Navbar />
    <div className="flex-grow">{children}</div>
    <Footer />
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-[#faf8f5]">{children}</div>
);

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />

        {/* Inventory & Legacy Aliases */}
        <Route path="/available-kittens" element={<PublicLayout><AvailableKittens /></PublicLayout>} />
        <Route path="/available" element={<Navigate to="/available-kittens" replace />} />
        <Route path="/kittens" element={<Navigate to="/available-kittens" replace />} />
        <Route path="/kitten/:id" element={<PublicLayout><KittenDetail /></PublicLayout>} />
        <Route path="/retired-adults" element={<PublicLayout><RetiredAdults /></PublicLayout>} />
        <Route path="/retired-cats" element={<Navigate to="/retired-adults" replace />} />
        <Route path="/upcoming-litters" element={<PublicLayout><UpcomingLitters /></PublicLayout>} />

        {/* Adoption & Care */}
        <Route path="/apply" element={<PublicLayout><AdoptionApplication /></PublicLayout>} />
        <Route path="/pricing-deposit" element={<PublicLayout><PricingDeposit /></PublicLayout>} />
        <Route path="/pricing" element={<Navigate to="/pricing-deposit" replace />} />
        <Route path="/shipping" element={<PublicLayout><ShippingDelivery /></PublicLayout>} />
        <Route path="/shipping-delivery" element={<Navigate to="/shipping" replace />} />
        <Route path="/delivery" element={<Navigate to="/shipping" replace />} />
        <Route path="/health" element={<PublicLayout><HealthGuarantee /></PublicLayout>} />
        <Route path="/health-guarantee" element={<Navigate to="/health" replace />} />
        <Route path="/vetting-process" element={<PublicLayout><VettingProcess /></PublicLayout>} />
        <Route path="/vetting" element={<Navigate to="/vetting-process" replace />} />
        <Route path="/care-guide" element={<PublicLayout><CareGuide /></PublicLayout>} />

        {/* About, Reviews & Contact */}
        <Route path="/about" element={<PublicLayout><AboutBreeder /></PublicLayout>} />
        <Route path="/reviews" element={<PublicLayout><ReviewsPage /></PublicLayout>} />
        <Route path="/submit-review" element={<Navigate to="/reviews" replace />} />
        <Route path="/contact" element={<PublicLayout><ContactUs /></PublicLayout>} />
        <Route path="/terms-policy" element={<PublicLayout><PolicyPage /></PublicLayout>} />
        <Route path="/privacy" element={<Navigate to="/terms-policy" replace />} />
        <Route path="/terms" element={<Navigate to="/terms-policy" replace />} />

        {/* --- ADMIN AUTH --- */}
        <Route path="/login" element={<Navigate to="/admin-only-login" replace />} />
        <Route path="/admin/login" element={<Navigate to="/admin-only-login" replace />} />
        <Route
          path="/admin-only-login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        {/* --- PROTECTED ADMIN DASHBOARD --- */}
        <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin-dashboard" replace />} />
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* --- 404 CATCH-ALL --- */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="py-36 px-4 text-center bg-[#faf8f5] text-[#181615]">
                <h1 className="font-serif text-7xl sm:text-8xl font-semibold text-[#9e5a3c]/25">
                  404
                </h1>
                <p className="mt-3 font-serif text-3xl font-semibold text-[#181615]">
                  Page Not Found
                </p>
                <p className="mt-2 text-sm text-[#575049]">
                  The nursery page you are looking for may have moved.
                </p>
                <Link
                  to="/"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 bg-[#181615] text-white rounded-full text-xs font-semibold hover:bg-[#9e5a3c] transition-colors"
                >
                  Return to MunchkinKittie Home
                </Link>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </>
  );
}
