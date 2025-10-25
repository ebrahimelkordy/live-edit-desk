import { Home, User, Briefcase, BookOpen, Image as ImageIcon, Moon, Sun, Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export const Navigation = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const navItems = [
    { icon: Home, label: "", path: "/" },
    { icon: User, label: "About", path: "/about" },
    { icon: Briefcase, label: "Work", path: "/work" },
    { icon: BookOpen, label: "Blog", path: "/blog" },
    { icon: ImageIcon, label: "Gallery", path: "/gallery" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-[hsl(var(--nav-bg))] backdrop-blur-sm rounded-full shadow-[var(--nav-shadow)] px-4 py-2.5 flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors text-sm ${
              location.pathname === item.path
                ? "bg-accent/20"
                : "hover:bg-accent/10"
            }`}
            aria-label={item.label || "Home"}
          >
            <item.icon className="h-4 w-4" />
            {item.label && <span className="font-medium hidden sm:inline">{item.label}</span>}
          </Link>
        ))}
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full h-8 w-8"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Link to="/dashboard">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            aria-label="Dashboard"
          >
            <Lock className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </nav>
  );
};
