import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

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
import AdoptionApplication from './pages/AdoptionApplication'; // 🐾 New

// ADMIN
import AdminDashboard from './components/AdminDashboard';

/**
 * 🚀 UPGRADE: ScrollToTop
 * Automatically scrolls the window to the top whenever the URL path changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * 🌍 LAYOUTS
 */
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-zinc-50">
    {children}
  </div>
);

const App = () => {
  return (
    <>
      <ScrollToTop /> {/* UX Upgrade */}
      <Routes>

        {/* --- 🌍 PUBLIC ROUTES --- */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        
        {/* Inventory & Legacy */}
        <Route path="/available-kittens" element={<PublicLayout><AvailableKittens /></PublicLayout>} />
        <Route path="/kitten/:id" element={<PublicLayout><KittenDetail /></PublicLayout>} />
        <Route path="/retired-adults" element={<PublicLayout><RetiredAdults /></PublicLayout>} />
        <Route path="/upcoming-litters" element={<PublicLayout><UpcomingLitters /></PublicLayout>} />
        
        {/* The Process */}
        <Route path="/apply" element={<PublicLayout><AdoptionApplication /></PublicLayout>} />
        <Route path="/pricing-deposit" element={<PublicLayout><PricingDeposit /></PublicLayout>} />
        <Route path="/shipping" element={<PublicLayout><ShippingDelivery /></PublicLayout>} />
        <Route path="/health" element={<PublicLayout><HealthGuarantee /></PublicLayout>} />
        <Route path="/vetting-process" element={<PublicLayout><VettingProcess /></PublicLayout>} />
        <Route path="/care-guide" element={<PublicLayout><CareGuide /></PublicLayout>} />
        
        {/* About & Trust */}
        <Route path="/about" element={<PublicLayout><AboutBreeder /></PublicLayout>} />
        <Route path="/reviews" element={<PublicLayout><ReviewsPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactUs /></PublicLayout>} />
        <Route path="/terms-policy" element={<PublicLayout><PolicyPage /></PublicLayout>} />

        {/* --- 🔐 ADMIN AUTH (PUBLIC ONLY) --- */}
        <Route 
          path="/admin-only-login" 
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          } 
        />

        {/* --- 🔐 PROTECTED ADMIN DASHBOARD --- */}
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

        {/* 🚀 UPGRADE: 404 Catch-all */}
        <Route 
          path="*" 
          element={
            <PublicLayout>
              <div className="py-60 text-center">
                <h1 className="text-9xl font-black text-zinc-100 mb-4">404</h1>
                <p className="text-zinc-400 font-black uppercase tracking-widest text-xs">Page Not Found</p>
                <a href="/" className="mt-10 inline-block text-[10px] font-black uppercase tracking-widest border-b-2 border-green-600 pb-1">Return Home</a>
              </div>
            </PublicLayout>
          } 
        />

      </Routes>
    </>
  );
};

export default App;