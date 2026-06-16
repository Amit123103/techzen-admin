"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Briefcase } from "lucide-react";

interface JobRole {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  created_at?: string;
}

export default function CareersAdminPage() {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<JobRole>>({});
  
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/admin/roles");
      const data = await res.json();
      if (res.ok) {
        setRoles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (role?: JobRole) => {
    if (role) {
      setFormData(role);
    } else {
      setFormData({ title: "", department: "", type: "Full-time", location: "Remote" });
    }
    setModalOpen(true);
  };

  const saveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = !!formData.id;
      const url = isEdit ? `/api/admin/roles/${formData.id}` : "/api/admin/roles";
      const method = isEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        await fetchRoles();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      const res = await fetch(`/api/admin/roles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRoles(roles.filter(r => r.id !== id));
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <Briefcase className="w-6 h-6" /> Job Roles
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Manage open positions displayed on the careers page.</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-accent)]/90 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Role
        </button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden">
        {roles.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-muted)]">
            <p>No job roles found. Create one to get started.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]/50">
                <th className="p-4 text-sm font-medium text-[var(--color-muted)]">Role Title</th>
                <th className="p-4 text-sm font-medium text-[var(--color-muted)] hidden md:table-cell">Department</th>
                <th className="p-4 text-sm font-medium text-[var(--color-muted)] hidden lg:table-cell">Type</th>
                <th className="p-4 text-sm font-medium text-[var(--color-muted)] hidden sm:table-cell">Location</th>
                <th className="p-4 text-sm font-medium text-[var(--color-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-background)]/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-[var(--color-text)]">{role.title}</div>
                    <div className="text-xs text-[var(--color-muted)] md:hidden mt-1">{role.department} • {role.type}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm text-[var(--color-text)]">{role.department}</td>
                  <td className="p-4 hidden lg:table-cell text-sm text-[var(--color-text)]">
                    <span className="bg-[var(--color-background)] px-2 py-1 rounded text-xs border border-[var(--color-border)]">{role.type}</span>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-sm text-[var(--color-muted)]">{role.location}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(role)} className="p-2 text-[var(--color-muted)] hover:text-[#0A66C2] transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteRole(role.id)} className="p-2 text-[var(--color-muted)] hover:text-red-500 transition-colors" title="Delete">
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-background)]">
              <h2 className="text-lg font-bold text-[var(--color-text)]">{formData.id ? "Edit Role" : "Add New Role"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">✕</button>
            </div>
            <form onSubmit={saveRole} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]">Job Title</label>
                <input required type="text" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50" placeholder="e.g. Senior Frontend Engineer" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]">Department</label>
                <input required type="text" value={formData.department || ""} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50" placeholder="e.g. Engineering" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]">Type</label>
                <select required value={formData.type || "Full-time"} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]">Location</label>
                <input required type="text" value={formData.location || ""} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50" placeholder="e.g. Remote (US Only)" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] border border-transparent">Cancel</button>
                <button type="submit" disabled={saving} className="bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-accent)]/90 disabled:opacity-50 flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
