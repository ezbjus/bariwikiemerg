import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  BookOpen, LogOut, LayoutDashboard, List, PlusCircle, Upload,
  Save, ArrowLeft, Sparkles, Plus, X
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const CATEGORIES = [
  'Procedures', 'Complications', 'Anatomy', 'Nutrition', 'Medications',
  'Conditions', 'Diagnostic Tests', 'Patient Care', 'Equipment', 'Outcomes', 'Uncategorized'
];

const AdminEditTerm = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    category: 'Uncategorized',
    status: 'draft',
    related_terms: [],
    authority_links: []
  });

  const [newRelatedTerm, setNewRelatedTerm] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '', source: '' });

  useEffect(() => {
    if (!isNew) {
      fetchTerm();
    }
  }, [id]);

  const fetchTerm = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_URL}/api/admin/terms/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || '',
          description: data.description || '',
          short_description: data.short_description || '',
          category: data.category || 'Uncategorized',
          status: data.status || 'draft',
          related_terms: data.related_terms || [],
          authority_links: data.authority_links || []
        });
      }
    } catch (error) {
      console.error('Failed to fetch term:', error);
      toast.error('Failed to load term');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');

    try {
      const url = isNew 
        ? `${API_URL}/api/admin/terms` 
        : `${API_URL}/api/admin/terms/${id}`;
      
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(isNew ? 'Term created!' : 'Term updated!');
        navigate('/admin/terms');
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Save failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!id) {
      toast.error('Save the term first before generating');
      return;
    }
    
    setGenerating(true);
    const token = localStorage.getItem('adminToken');
    toast.info('Generating description with AI...');

    try {
      const response = await fetch(`${API_URL}/api/admin/terms/${id}/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const term = data.term;
        setFormData(prev => ({
          ...prev,
          description: term.description || prev.description,
          short_description: term.short_description || prev.short_description,
          category: term.category || prev.category,
          related_terms: term.related_terms || prev.related_terms,
          authority_links: term.authority_links || prev.authority_links
        }));
        toast.success('Description generated!');
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Generation failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const addRelatedTerm = () => {
    if (newRelatedTerm.trim()) {
      setFormData(prev => ({
        ...prev,
        related_terms: [...prev.related_terms, newRelatedTerm.trim()]
      }));
      setNewRelatedTerm('');
    }
  };

  const removeRelatedTerm = (index) => {
    setFormData(prev => ({
      ...prev,
      related_terms: prev.related_terms.filter((_, i) => i !== index)
    }));
  };

  const addAuthorityLink = () => {
    if (newLink.url.trim()) {
      setFormData(prev => ({
        ...prev,
        authority_links: [...prev.authority_links, { ...newLink }]
      }));
      setNewLink({ title: '', url: '', source: '' });
    }
  };

  const removeAuthorityLink = (index) => {
    setFormData(prev => ({
      ...prev,
      authority_links: prev.authority_links.filter((_, i) => i !== index)
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isNew ? 'Add Term' : 'Edit Term'} - BariWiki Admin</title>
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
                <Link to="/admin/terms" className="flex items-center gap-2 px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100">
                  <List className="h-4 w-4" />All Terms
                </Link>
              </li>
              <li>
                <Link to="/admin/terms/new" className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700">
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
            <div className="flex items-center gap-4 mb-6">
              <Link to="/admin/terms">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />Back
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold">
                {isNew ? 'Add New Term' : 'Edit Term'}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
              {/* Basic Info */}
              <div className="bg-white p-6 rounded-lg border space-y-4">
                <h2 className="font-semibold">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter term name"
                    required
                    data-testid="term-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Short Description</label>
                  <Input
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    placeholder="Brief 1-2 sentence description"
                    maxLength={160}
                    data-testid="term-short-desc-input"
                  />
                  <p className="text-xs text-neutral-500 mt-1">{formData.short_description.length}/160 characters</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border bg-white text-sm"
                      data-testid="term-category-select"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border bg-white text-sm"
                      data-testid="term-status-select"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-6 rounded-lg border space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Description</h2>
                  {!isNew && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateDescription}
                      disabled={generating}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {generating ? 'Generating...' : 'Generate with AI'}
                    </Button>
                  )}
                </div>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Full description (HTML supported)"
                  rows={10}
                  data-testid="term-description-input"
                />
                <p className="text-xs text-neutral-500">
                  HTML tags supported: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;h2&gt;
                </p>
              </div>

              {/* Related Terms */}
              <div className="bg-white p-6 rounded-lg border space-y-4">
                <h2 className="font-semibold">Related Terms</h2>
                <div className="flex gap-2">
                  <Input
                    value={newRelatedTerm}
                    onChange={(e) => setNewRelatedTerm(e.target.value)}
                    placeholder="Add related term"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRelatedTerm())}
                  />
                  <Button type="button" variant="outline" onClick={addRelatedTerm}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.related_terms.map((term, index) => (
                    <span key={index} className="inline-flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded text-sm">
                      {term}
                      <button type="button" onClick={() => removeRelatedTerm(index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Authority Links */}
              <div className="bg-white p-6 rounded-lg border space-y-4">
                <h2 className="font-semibold">Authority Links</h2>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={newLink.source}
                    onChange={(e) => setNewLink(prev => ({ ...prev, source: e.target.value }))}
                    placeholder="Source (e.g., NIH)"
                  />
                  <Input
                    value={newLink.title}
                    onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Link title"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newLink.url}
                      onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="URL"
                    />
                    <Button type="button" variant="outline" onClick={addAuthorityLink}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {formData.authority_links.map((link, index) => (
                    <div key={index} className="flex items-center justify-between bg-neutral-50 p-2 rounded text-sm">
                      <span>
                        <strong>{link.source}</strong>: {link.title || link.url}
                      </span>
                      <button type="button" onClick={() => removeAuthorityLink(index)}>
                        <X className="h-4 w-4 text-neutral-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="submit" disabled={saving} data-testid="admin-save-term-button">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Term'}
                </Button>
                <Link to="/admin/terms">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminEditTerm;
