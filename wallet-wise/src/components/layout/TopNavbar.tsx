import React from "react";
import { Menu, Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "../theme-provider";
import Button from "../common/Button";
import { useLocation } from "react-router-dom";

interface TopNavbarProps {
  onMenuOpen: () => void;
  isMockMode?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuOpen, isMockMode = false }) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  // Map path to page titles
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/expenses") return "Expenses";
    if (path === "/income") return "Income";
    if (path === "/budget") return "Budget Limits";
    if (path === "/reports") return "Financial Reports";
    if (path === "/settings") return "Settings";
    return "WalletWise";
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full flex items-center justify-between px-6 border-b border-border/40 bg-background/60 backdrop-blur-md">
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground md:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground select-none">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side: Mock Database Pill + Theme Toggle */}
      <div className="flex items-center gap-3">
        {isMockMode && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-950/20 text-xs font-semibold select-none border border-amber-500/20">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Mock DB Sandbox
          </span>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-10 h-10 p-0 rounded-xl hover:bg-muted/50 flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default TopNavbar;
