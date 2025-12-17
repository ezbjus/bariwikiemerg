import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  BookOpen, LogOut, LayoutDashboard, List, PlusCircle, Upload,
  Search, Edit, Trash2, Sparkles, Eye, EyeOff, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import CategoryBadge from '../components/CategoryBadge';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const AdminTerms = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchTerms = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      let url = `${API_URL}/api/admin/terms?page=${page}&limit=25`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTerms(data.terms || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch terms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTerms();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_URL}/api/admin/terms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Term deleted');
        fetchTerms();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast.error('Failed to delete term');
    }
  };

  const handlePublish = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_URL}/api/admin/terms/${id}/publish`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Term published');
        fetchTerms();
      }
    } catch (error) {
      toast.error('Failed to publish term');
    }
  };

  const handleGenerateDescription = async (id) => {
    const token = localStorage.getItem('adminToken');
    toast.info('Generating description with AI...');
    try {
      const response = await fetch(`${API_URL}/api/admin/terms/${id}/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Description generated!');
        fetchTerms();
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Generation failed');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <>
      <Helmet>
        <title>Manage Terms - BariWiki Admin</title>
      </Helmet>

      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">BariWiki Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm text-neutral-600 hover:text-neutral-900">View Site</a>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <nav className="admin-sidebar p-4 hidden md:block">
            <ul className="space-y-1">
              <li>
                <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100">
                  <LayoutDashboard className="h-4 w-4" />Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/terms" className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700">
                  <List className="h-4 w-4" />All Terms
                </Link>
              </li>
              <li>
                <Link to="/admin/terms/new" className="flex items-center gap-2 px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100">
                  <PlusCircle className="h-4 w-4" />Add Term
                </Link>
              </li>
              <li>
                <Link to="/admin/import" className="flex items-center gap-2 px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100">
                  <Upload className="h-4 w-4" />Import Terms
                </Link>
              </li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="admin-content flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold">All Terms</h1>
              <Link to="/admin/terms/new">
                <Button data-testid="admin-add-term-button">
                  <PlusCircle className="h-4 w-4 mr-2" />Add Term
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border mb-6">
              <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="search"
                    placeholder="Search terms..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                    data-testid="admin-search-input"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="h-10 px-3 rounded-md border bg-white text-sm"
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <Button type="submit">Search</Button>
              </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border overflow-hidden" data-testid="admin-term-table">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3"><div className="skeleton h-4 w-48" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><div className="skeleton h-4 w-24" /></td>
                        <td className="px-4 py-3"><div className="skeleton h-4 w-16" /></td>
                        <td className="px-4 py-3"><div className="skeleton h-4 w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : terms.length > 0 ? (
                    terms.map((term) => (
                      <tr key={term._id} className="hover:bg-neutral-50">
                        <td className="px-4 py-3">
                          <div className="font-medium">{term.name}</div>
                          {term.short_description && (
                            <div className="text-xs text-neutral-500 truncate max-w-xs">
                              {term.short_description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <CategoryBadge category={term.category} linkable={false} />
                        </td>
                        <td className="px-4 py-3">
                          {term.status === 'published' ? (
                            <span className="inline-flex items-center gap-1 text-green-700 text-xs">
                              <Eye className="h-3 w-3" />Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 text-xs">
                              <EyeOff className="h-3 w-3" />Draft
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerateDescription(term._id)}
                              title="Generate AI Description"
                            >
                              <Sparkles className="h-4 w-4" />
                            </Button>
                            {term.status === 'draft' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePublish(term._id)}
                                title="Publish"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Link to={`/admin/terms/${term._id}/edit`}>
                              <Button variant="ghost" size="sm" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(term._id, term.name)}
                              title="Delete"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                        No terms found. <Link to="/admin/import" className="text-blue-600 hover:underline">Import some terms</Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t px-4 py-3 flex items-center justify-between">
                  <div className="text-sm text-neutral-500">
                    Showing {((page - 1) * 25) + 1} to {Math.min(page * 25, total)} of {total} terms
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">Page {page} of {totalPages}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminTerms;
