import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "@/lib/storage";
import { Portfolio } from "./Portfolio";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export const Dashboard = () => {
  const navigate = useNavigate();

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

  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-50">
        <Button onClick={handleLogout} variant="outline" size="sm" className="shadow-lg">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
      <Portfolio isEditable={true} />
    </div>
  );
};
