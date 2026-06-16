import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, Settings, MessageSquare, Briefcase, Inbox } from "lucide-react";
import { SignOutButton } from "@/components/ui/SignOutButton";

const navigation = [
  { name: "Submissions", href: "/", icon: LayoutDashboard },
  { name: "Subscribers", href: "/subscribers", icon: Users },
  { name: "Testimonials", href: "/testimonials", icon: MessageSquare },
  { name: "Broadcast Email", href: "/broadcast", icon: FileText },
  { name: "Job Roles", href: "/careers", icon: Briefcase },
  { name: "Job Applications", href: "/applications", icon: Inbox },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-background)] border-r border-[var(--color-border)] flex-shrink-0 fixed inset-y-0 z-10 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-[var(--color-text)] flex items-center justify-center">
              <span className="text-[var(--color-background)] font-bold text-lg leading-none">R</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--color-text)]">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]`}
            >
              <item.icon className={`w-5 h-5 text-[var(--color-muted)]`} />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--color-border)]">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 flex flex-col min-w-0">
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
