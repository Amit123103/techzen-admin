import { SocialSettingsForm } from "@/components/admin/SocialSettingsForm";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Profile Configuration</h2>
          <p className="text-sm text-[var(--color-muted)] mt-1">Update your admin profile details.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text)]">Admin Name</label>
            <input 
              type="text" 
              className="w-full md:w-1/2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 text-[var(--color-text)] transition-all"
              placeholder="Admin"
              defaultValue="Admin User"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text)]">Email Address</label>
            <input 
              type="email" 
              className="w-full md:w-1/2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 text-[var(--color-text)] transition-all"
              placeholder="admin@reinformtech.com"
              defaultValue="admin@reinformtech.com"
            />
          </div>
        </div>

        <div className="bg-[var(--color-background)]/50 p-6 flex justify-end border-t border-[var(--color-border)]">
          <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Security</h2>
          <p className="text-sm text-[var(--color-muted)] mt-1">Update your password and secure your account.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text)]">Current Password</label>
            <input 
              type="password" 
              className="w-full md:w-1/2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 text-[var(--color-text)] transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text)]">New Password</label>
            <input 
              type="password" 
              className="w-full md:w-1/2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 text-[var(--color-text)] transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="bg-[var(--color-background)]/50 p-6 flex justify-end border-t border-[var(--color-border)]">
          <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Update Password
          </button>
        </div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden">
        <SocialSettingsForm />
      </div>
    </div>
  );
}
