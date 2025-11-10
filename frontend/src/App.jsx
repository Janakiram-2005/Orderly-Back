import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { Spinner } from "react-bootstrap"; 

// Context Providers
import { AuthProvider } from './context/AuthContext'; 
import { CartProvider } from './context/CartContext'; 
import { useAuth } from './context/AuthContext'; 

// Page Components
import WelcomePage from "./components/WelcomePage.jsx";
import AdminAuthPage from "./components/AdminAuthPage.jsx";
import CustomerAuthPage from "./components/CustomerAuthPage.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import CustomerOrderTracker from "./components/CustomerOrderTracker.jsx";
import DeliveryTracker from "./components/DeliveryTracker.jsx";
import CustomerDashboard from "./components/CustomerDashboard.jsx";
import ShopDetails from "./components/ShopDetails.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import AuthPage from './components/AuthPage.jsx'; 

// --- Loading Spinner Component ---
const FullPageSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

// --- Protected Route (Your version is perfect, unchanged) ---
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth(); 

  if (loading) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; 
};

// --- ⭐️ NEW: RedirectIfAuth Component ⭐️ ---
// This component redirects logged-in users away from public-only pages (like login).
const RedirectIfAuth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageSpinner />;
  }

  if (!user) {
    // No user, so show the public page (e.g., login form)
    return <Outlet />;
  }

  // User IS logged in, so redirect them to their correct dashboard
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'customer':
      return <Navigate to="/customer/dashboard" replace />;
    case 'owner':
      return <Navigate to="/dashboard" replace />;
    case 'delivery':
      return <Navigate to="/delivery/tracker" replace />;
    default:
      // Fallback for any other logged-in user
      return <Navigate to="/" replace />;
  }
};

// --- Placeholder components (Unchanged) ---
const Manage = () => ( <div className="p-3 bg-white rounded shadow-sm"> <h2>Manage</h2> <p>...</p> </div> );
const Orders = () => ( <div className="p-3 bg-white rounded shadow-sm"> <h2>Orders</h2> <p>...</p> </div> );
const Complaints = () => ( <div className="p-3 bg-white rounded shadow-sm"> <h2>Complaints</h2> <p>...</p> </div> );
const Profile = () => ( <div className="p-3 bg-white rounded shadow-sm"> <h2>Profile</h2> <p>...</p> </div> );
const Notifications = () => ( <div className="p-3 bg-white rounded shadow-sm"> <h2>Notifications</h2> <p>...</p> </div> );

// --- App Component (Routes are unchanged) ---
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<WelcomePage />} />

          {/* --- ⭐️ MODIFIED: Public-Only Routes ⭐️ --- */}
          {/* These routes are only for users who are NOT logged in. */}
          <Route element={<RedirectIfAuth />}>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/admin/login" element={<AdminAuthPage />} />
            <Route path="/customer/login" element={<CustomerAuthPage />} />
          </Route>

          {/* --- Protected Customer Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/tracker" element={<CustomerOrderTracker />} />
            <Route path="/shop/:shopId" element={<ShopDetails />} />
          </Route>

          {/* --- Protected Admin Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* --- Protected Delivery Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={['delivery']} />}>
            <Route path="/delivery/tracker" element={<DeliveryTracker />} />
          </Route>

          {/* --- Protected Owner Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="manage" replace />} />
              <Route path="manage" element={<Manage />} />
              <Route path="orders" element={<Orders />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Route>

          {/* --- Fallback 404 Page (Unchanged) --- */}
          <Route
            path="*"
            element={
              <div
                style={{
                  height: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#f8f9fa",
                  color: "#333",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <h1>404 - Page Not Found</h1>
                <p>Oops! The page you’re looking for doesn’t exist.</p>
                <a
                  href="/"
                  style={{
                    marginTop: "10px",
                    textDecoration: "none",
                    background: "#007bff",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    transition: "0.3s",
                  }}
                >
                  Go Back Home
                </a>
              </div>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;