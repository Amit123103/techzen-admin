"use client";

import { useState, useEffect } from "react";
import { Loader2, Inbox, Eye, Trash2, Code, Link, Globe, Phone, Mail, User } from "lucide-react";

interface JobApplication {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  github_url: string;
  portfolio_url: string;
  other_url: string;
  papers_description: string;
  cover_letter: string;
  status: string;
  created_at: string;
}

export default function ApplicationsAdminPage() {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  
  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      if (res.ok) {
        setApps(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setApps(apps.map(a => a.id === id ? { ...a, status } : a));
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp({ ...selectedApp, status });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteApp = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const res = await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApps(apps.filter(a => a.id !== id));
        if (selectedApp && selectedApp.id === id) setSelectedApp(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-muted)]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <Inbox className="w-6 h-6" /> Job Applications
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">Review and manage candidate submissions.</p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden">
        {apps.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-muted)]">
            <p>No job applications received yet.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]/50">
                <th className="p-4 text-sm font-medium text-[var(--color-muted)]">Candidate</th>
                <th className="p-4 text-sm font-medium text-[var(--color-muted)] hidden sm:table-cell">Role</th>
                <th className="p-4 text-sm font-medium text-[var(--color-muted)] hidden md:table-cell">Date</th>
                <th className="p-4 text-sm font-medium text-[var(--color-muted)] hidden lg:table-cell">Status</th>
                <th className="p-4 text-sm font-medium text-[var(--color-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-background)]/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-[var(--color-text)]">{app.name}</div>
                    <div className="text-xs text-[var(--color-muted)] mt-1">{app.email}</div>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-sm text-[var(--color-text)] font-medium">{app.role}</td>
                  <td className="p-4 hidden md:table-cell text-sm text-[var(--color-muted)]">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded text-xs border ${
                      app.status === 'new' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      app.status === 'reviewed' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      app.status === 'accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setSelectedApp(app)} className="p-2 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteApp(app.id)} className="p-2 text-[var(--color-muted)] hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-background)] shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)]">Application for {selectedApp.role}</h2>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-xs border font-medium ${
                    selectedApp.status === 'new' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    selectedApp.status === 'reviewed' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                    selectedApp.status === 'accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {selectedApp.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-[var(--color-muted)] flex items-center">
                    Submitted: {new Date(selectedApp.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-[var(--color-muted)] hover:text-[var(--color-text)] p-2 rounded-lg hover:bg-[var(--color-background)]">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Candidate Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-[var(--color-muted)]" />
                      <span className="text-[var(--color-text)]">{selectedApp.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[var(--color-muted)]" />
                      <a href={`mailto:${selectedApp.email}`} className="text-[var(--color-accent)] hover:underline">{selectedApp.email}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[var(--color-muted)]" />
                      <a href={`tel:${selectedApp.phone}`} className="text-[var(--color-text)]">{selectedApp.phone || 'N/A'}</a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Links</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Link className="w-4 h-4 text-[#0A66C2]" />
                      {selectedApp.portfolio_url ? (
                        <a href={selectedApp.portfolio_url} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline truncate">LinkedIn / Portfolio</a>
                      ) : <span className="text-[var(--color-muted)]">N/A</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <Code className="w-4 h-4 text-[var(--color-text)]" />
                      {selectedApp.github_url ? (
                        <a href={selectedApp.github_url} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline truncate">GitHub Profile</a>
                      ) : <span className="text-[var(--color-muted)]">N/A</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-[var(--color-muted)]" />
                      {selectedApp.other_url ? (
                        <a href={selectedApp.other_url} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline truncate">Other Link</a>
                      ) : <span className="text-[var(--color-muted)]">N/A</span>}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-[var(--color-border)]" />

              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Cover Letter / Resume Details</h3>
                <div className="bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)] whitespace-pre-wrap text-sm text-[var(--color-text)] leading-relaxed">
                  {selectedApp.cover_letter || 'No cover letter provided.'}
                </div>
              </div>

              {selectedApp.papers_description && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Publications / Papers</h3>
                  <div className="bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)] whitespace-pre-wrap text-sm text-[var(--color-text)] leading-relaxed">
                    {selectedApp.papers_description}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-background)] flex flex-wrap gap-3 shrink-0">
              <select 
                value={selectedApp.status}
                onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 text-[var(--color-text)]"
              >
                <option value="new">Mark as New</option>
                <option value="reviewed">Mark as Reviewed</option>
                <option value="accepted">Mark as Accepted</option>
                <option value="rejected">Mark as Rejected</option>
              </select>
              <button 
                onClick={() => deleteApp(selectedApp.id)} 
                className="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors border border-red-500/20 ml-auto"
              >
                Delete Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
