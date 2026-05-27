import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  CalendarDays,
  BarChart3,
  Settings,
  Menu,
  X,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { to: '/shared', icon: Users, label: 'Shared' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/stats', icon: BarChart3, label: 'Statistics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border shadow-sm"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <CreditCard size={18} className="text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">SubsDay</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )
                }
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">
              SubsDay v1.0.0
            </p>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
