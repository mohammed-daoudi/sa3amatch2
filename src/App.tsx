import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ui/ErrorBoundary';
import HomePage from './pages/HomePage';
import FieldsPage from './pages/FieldsPage';
import FieldDetailsPage from './pages/FieldDetailsPage';
import BookingsPage from './pages/BookingsPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFields from './pages/admin/AdminFields';
import AdminBookings from './pages/admin/AdminBookings';
import AdminStats from './pages/admin/AdminStats';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          {/* Fixed Navbar Component */}
          <Navbar />

          {/* Main Content */}
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/fields" element={<FieldsPage />} />
              <Route path="/fields/:id" element={<FieldDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Authenticated User Routes */}
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/fields" element={<AdminFields />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/stats" element={<AdminStats />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Footer Component */}
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
