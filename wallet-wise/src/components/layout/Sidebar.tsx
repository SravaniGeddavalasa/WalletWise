import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Target,
  FileBarChart2,
  Settings,
  LogOut,
  User,
  Wallet,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Expenses", path: "/expenses", icon: Receipt },
    { name: "Income", path: "/income", icon: TrendingUp },
    { name: "Budget", path: "/budget", icon: Target },
    { name: "Reports", path: "/reports", icon: FileBarChart2 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 h-screen bg-card border-r border-border/50 text-foreground transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header / Brand */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border/40 select-none">
          <Link to="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="p-1.5 bg-primary rounded-lg">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">WalletWise</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted/50 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                <span>{item.name}</span>
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary-foreground rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile Card */}
        {user && (
          <div className="p-4 border-t border-border/40 bg-muted/10">
            <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate leading-none text-foreground mb-1">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate leading-none">{user.email}</p>
              </div>
            </div>
            
            <button
              onClick={() => logout()}
              className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/30 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
