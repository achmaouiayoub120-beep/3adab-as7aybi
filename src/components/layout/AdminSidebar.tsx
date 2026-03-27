import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Trophy,
  MapPin,
  Calendar,
  Ticket,
  BarChart3,
  LogOut,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import botolaLogo from "@/assets/botola-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Calendar, label: "Matchs", href: "/admin/matches" },
  { icon: Trophy, label: "Équipes", href: "/admin/teams" },
  { icon: MapPin, label: "Stades", href: "/admin/stadiums" },
  { icon: Ticket, label: "Billetterie", href: "/admin/ticketing" },
  { icon: Users, label: "Utilisateurs", href: "/admin/users" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-strong border-r border-border z-50 flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={botolaLogo} alt="Botola Pro" className="h-10 w-auto" />
          <div>
            <span className="text-display text-xl tracking-wide text-foreground block leading-tight">
              BOTOLA <span className="text-primary">TICKET</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg font-heading text-sm transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-heading text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
