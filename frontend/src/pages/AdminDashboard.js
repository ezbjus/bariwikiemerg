import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  BookOpen, FileText, Upload, LogOut, 
  LayoutDashboard, List, PlusCircle, CheckCircle 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_terms: 0, published: 0, drafts: 0, categories: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleBatchPublish = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_URL}/api/admin/batch-publish`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      toast.success(data.message);
      fetchStats();
    } catch (error) {
      toast.error('Failed to publish terms');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - BariWiki</title>
      </Helmet>

      <div className="min-h-screen bg-neutral-50">
        {/* Admin Header */}
        <header className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">BariWiki Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
                View Site
              </a>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <nav className="admin-sidebar p-4 hidden md:block">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/terms" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100"
                >
                  <List className="h-4 w-4" />
                  All Terms
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/terms/new" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Term
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/import" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100"
                >
                  <Upload className="h-4 w-4" />
                  Import Terms
                </Link>
              </li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="admin-content flex-1">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold" data-testid="stat-total">
                      {loading ? '-' : stats.total_terms}
                    </div>
                    <div className="text-sm text-neutral-500">Total Terms</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold" data-testid="stat-published">
                      {loading ? '-' : stats.published}
                    </div>
                    <div className="text-sm text-neutral-500">Published</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold" data-testid="stat-drafts">
                      {loading ? '-' : stats.drafts}
                    </div>
                    <div className="text-sm text-neutral-500">Drafts</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <List className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold" data-testid="stat-categories">
                      {loading ? '-' : stats.categories}
                    </div>
                    <div className="text-sm text-neutral-500">Categories</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link 
                to="/admin/import"
                className="bg-white p-6 rounded-lg border hover:border-blue-300 transition-colors"
              >
                <Upload className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium">Import Terms</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Bulk import terms from Excel or CSV
                </p>
              </Link>

              <Link 
                to="/admin/terms/new"
                className="bg-white p-6 rounded-lg border hover:border-blue-300 transition-colors"
              >
                <PlusCircle className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-medium">Add New Term</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Create a new term entry
                </p>
              </Link>

              <button 
                onClick={handleBatchPublish}
                className="bg-white p-6 rounded-lg border hover:border-blue-300 transition-colors text-left"
              >
                <CheckCircle className="h-8 w-8 text-amber-600 mb-2" />
                <h3 className="font-medium">Publish All Drafts</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Publish all draft terms at once
                </p>
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
