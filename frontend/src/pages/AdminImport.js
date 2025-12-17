import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  BookOpen, LogOut, LayoutDashboard, List, PlusCircle, Upload,
  FileSpreadsheet, CheckCircle, AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const AdminImport = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['.xlsx', '.xls', '.csv'];
      const isValid = validTypes.some(type => selectedFile.name.toLowerCase().endsWith(type));
      if (isValid) {
        setFile(selectedFile);
        setResult(null);
      } else {
        toast.error('Please select an Excel (.xlsx, .xls) or CSV file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/admin/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          imported: data.imported,
          skipped: data.skipped,
          message: data.message
        });
        toast.success(data.message);
      } else {
        setResult({
          success: false,
          message: data.detail || 'Import failed'
        });
        toast.error(data.detail || 'Import failed');
      }
    } catch (error) {
      setResult({
        success: false,
        message: error.message
      });
      toast.error('Import failed');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <>
      <Helmet>
        <title>Import Terms - BariWiki Admin</title>
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
                <Link to="/admin/terms/new" className="flex items-center gap-2 px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100">
                  <PlusCircle className="h-4 w-4" />Add Term
                </Link>
              </li>
              <li>
                <Link to="/admin/import" className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700">
                  <Upload className="h-4 w-4" />Import Terms
                </Link>
              </li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="admin-content flex-1">
            <h1 className="text-2xl font-semibold mb-6">Import Terms</h1>

            <div className="max-w-xl">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h2 className="font-medium text-blue-900 mb-2">Import Instructions</h2>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Upload an Excel (.xlsx, .xls) or CSV file</li>
                  <li>• Terms should be in the first column</li>
                  <li>• Duplicate terms will be automatically skipped</li>
                  <li>• Imported terms will be saved as drafts</li>
                </ul>
              </div>

              {/* File Upload */}
              <div className="bg-white p-6 rounded-lg border">
                <div 
                  className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const droppedFile = e.dataTransfer.files[0];
                    if (droppedFile) handleFileChange({ target: { files: [droppedFile] }});
                  }}
                >
                  <FileSpreadsheet className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-2">Drag and drop your file here, or</p>
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:underline">browse files</span>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                      data-testid="admin-import-file-input"
                    />
                  </label>
                </div>

                {file && (
                  <div className="mt-4 p-3 bg-neutral-50 rounded flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <button 
                      onClick={() => setFile(null)}
                      className="text-sm text-neutral-500 hover:text-neutral-700"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full mt-4"
                  data-testid="admin-bulk-import-button"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Importing...' : 'Import Terms'}
                </Button>
              </div>

              {/* Result */}
              {result && (
                <div className={`mt-6 p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <h3 className={`font-medium ${
                        result.success ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {result.success ? 'Import Successful!' : 'Import Failed'}
                      </h3>
                      <p className={`text-sm ${
                        result.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </p>
                      {result.success && (
                        <div className="mt-4">
                          <Link to="/admin/terms">
                            <Button size="sm">View Imported Terms</Button>
                          </Link>
                        </div>
                      )}
                    </div>
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

export default AdminImport;
