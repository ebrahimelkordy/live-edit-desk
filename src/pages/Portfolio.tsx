import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PortfolioData } from "@/types/portfolio";
import { loadPortfolioData, savePortfolioData, defaultPortfolioData } from "@/lib/storage";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock } from "lucide-react";

interface PortfolioProps {
  isEditable?: boolean;
}

export const Portfolio = ({ isEditable = false }: PortfolioProps) => {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const loaded = await loadPortfolioData();
      setData(loaded);
    };
    fetchData();
    if (isEditable) {
      const autoSave = setInterval(() => {
        savePortfolioData(data);
        toast.success("Auto-saved", { duration: 1000 });
      }, 30000);

      return () => clearInterval(autoSave);
    }
  }, [data, isEditable]);

  const handleHeroChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const handleAboutChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      about: { ...prev.about, [field]: value },
    }));
  };

  const handleSkillsChange = (skills: any[]) => {
    setData((prev) => ({ ...prev, skills }));
  };

  const handleProjectsChange = (projects: any[]) => {
    setData((prev) => ({ ...prev, projects }));
  };

  const handleSave = () => {
    savePortfolioData(data);
    toast.success("All changes saved!");
  };

  return (
    <div className="min-h-screen">
      {!isEditable && <Navigation />}
      {isEditable && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button onClick={handleSave} size="lg" className="shadow-lg">
            💾 Save All Changes
          </Button>
          <Button onClick={() => navigate("/")} variant="outline" size="lg" className="shadow-lg">
            👁️ View Portfolio
          </Button>
        </div>
      )}

      {!isEditable && (
        <Button
          onClick={() => navigate("/login")}
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 z-50 shadow-lg"
        >
          <Lock className="mr-2 h-4 w-4" /> Dashboard
        </Button>
      )}

      <Hero data={data.hero} onChange={handleHeroChange} isEditable={isEditable} />
      <About data={data.about} onChange={handleAboutChange} isEditable={isEditable} />
      <Skills skills={data.skills} onChange={handleSkillsChange} isEditable={isEditable} />
      <Projects projects={data.projects} onChange={handleProjectsChange} isEditable={isEditable} />
      
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="section-container text-center">
          <p className="text-lg">&copy; 2025 My Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
