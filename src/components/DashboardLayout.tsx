import { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { isAuthenticated, logout } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { LogOut, Home, User, Briefcase, BookOpen, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/dashboard/about", label: "About", icon: User },
    { path: "/dashboard/work", label: "Work", icon: Briefcase },
    { path: "/dashboard/blog", label: "Blog", icon: BookOpen },
    { path: "/dashboard/gallery", label: "Gallery", icon: ImageIcon },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-sm">Edit Mode</span>
            <nav className="flex gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    location.pathname === item.path
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/10"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16">{children}</div>

      {/* Edit Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="px-4 py-2 bg-accent text-accent-foreground rounded-full shadow-lg text-sm font-medium">
          ✏️ Editing
        </div>
      </div>
    </div>
  );
};
