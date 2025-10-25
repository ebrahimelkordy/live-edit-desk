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
    { icon: Home, label: "", href: "#" },
    { icon: User, label: "About", href: "#about" },
    { icon: Briefcase, label: "Work", href: "#projects" },
    { icon: BookOpen, label: "Blog", href: "#blog" },
    { icon: ImageIcon, label: "Gallery", href: "#gallery" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-[hsl(var(--nav-bg))] backdrop-blur-sm rounded-full shadow-[var(--nav-shadow)] px-4 py-2.5 flex items-center gap-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-accent/10 transition-colors text-sm"
            aria-label={item.label || "Home"}
          >
            <item.icon className="h-4 w-4" />
            {item.label && <span className="font-medium hidden sm:inline">{item.label}</span>}
          </a>
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
      </div>
    </nav>
  );
};
