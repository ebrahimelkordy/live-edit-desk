import { Home, User, Briefcase, BookOpen, Image as ImageIcon, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export const Navigation = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const navItems = [
    { icon: Home, label: "Home", href: "#" },
    { icon: User, label: "About", href: "#about" },
    { icon: Briefcase, label: "Work", href: "#projects" },
    { icon: BookOpen, label: "Skills", href: "#skills" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-[hsl(var(--nav-bg))] backdrop-blur-sm rounded-full shadow-[var(--nav-shadow)] px-6 py-3 flex items-center gap-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-accent/10 transition-colors"
            aria-label={item.label}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
          </a>
        ))}
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </nav>
  );
};
