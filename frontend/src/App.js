import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from './components/ui/sonner';

// Pages
import HomePage from './pages/HomePage';
import TermPage from './pages/TermPage';
import BrowsePage from './pages/BrowsePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ResourcesPage from './pages/ResourcesPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminTerms from './pages/AdminTerms';
import AdminEditTerm from './pages/AdminEditTerm';
import AdminImport from './pages/AdminImport';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Header /><HomePage /></>} />
            <Route path="/wiki/:slug" element={<><Header /><TermPage /></>} />
            <Route path="/browse/:letter" element={<><Header /><BrowsePage /></>} />
            <Route path="/category/:category" element={<><Header /><CategoryPage /></>} />
            <Route path="/search" element={<><Header /><SearchPage /></>} />
            <Route path="/resources" element={<><Header /><ResourcesPage /></>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/terms" element={
              <ProtectedRoute><AdminTerms /></ProtectedRoute>
            } />
            <Route path="/admin/terms/:id/edit" element={
              <ProtectedRoute><AdminEditTerm /></ProtectedRoute>
            } />
            <Route path="/admin/terms/new" element={
              <ProtectedRoute><AdminEditTerm /></ProtectedRoute>
            } />
            <Route path="/admin/import" element={
              <ProtectedRoute><AdminImport /></ProtectedRoute>
            } />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
