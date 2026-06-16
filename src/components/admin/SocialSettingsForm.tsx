"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export function SocialSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState({
    whatsapp: "",
    instagram: "",
    linkedin: "",
    phone: "",
    youtube: "",
    facebook: "",
    twitter: "",
    discord: "",
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings/social");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            whatsapp: data.whatsapp || "",
            instagram: data.instagram || "",
            linkedin: data.linkedin || "",
            phone: data.phone || "",
            youtube: data.youtube || "",
            facebook: data.facebook || "",
            twitter: data.twitter || "",
            discord: data.discord || "",
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings/social", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      
      setMessage({ text: "Social settings updated successfully!", type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message || "An error occurred", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-muted)]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 border-b border-[var(--color-border)]">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">Social Media Links</h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">Configure the social media URLs for the floating widget on the client website.</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(formData).map((key) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text)] capitalize">
              {key} URL
            </label>
            <input
              type={key === "phone" ? "tel" : "url"}
              name={key}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 text-[var(--color-text)] transition-all"
              placeholder={key === "phone" ? "tel:+1234567890" : `https://${key}.com/...`}
            />
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-background)]/50 p-6 flex justify-between items-center border-t border-[var(--color-border)]">
        <div>
          {message && (
            <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Social Links
        </button>
      </div>
    </form>
  );
}
