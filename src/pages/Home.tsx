import { useState } from "react";
import { loadPortfolioData, savePortfolioData } from "@/lib/storage";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { AnimatedBackground } from "@/components/AnimatedBackground";

interface HomeProps {
  isEditable?: boolean;
}

export const Home = ({ isEditable = false }: HomeProps) => {
  const [data, setData] = useState(loadPortfolioData());

  const handleHeroChange = (field: string, value: string) => {
    const updated = {
      ...data,
      hero: { ...data.hero, [field]: value },
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleAboutChange = (field: string, value: string) => {
    const updated = {
      ...data,
      about: { ...data.about, [field]: value },
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleSkillsChange = (skills: any[]) => {
    const updated = { ...data, skills };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleProjectsChange = (projects: any[]) => {
    const updated = { ...data, projects };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleContactChange = (field: string, value: any) => {
    const updated = {
      ...data,
      contact: { ...data.contact, [field]: value },
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Hero data={data.hero} onChange={handleHeroChange} isEditable={isEditable} />
        <About data={data.about} onChange={handleAboutChange} isEditable={isEditable} />
        <Skills skills={data.skills} onChange={handleSkillsChange} isEditable={isEditable} />
        <Projects projects={data.projects} onChange={handleProjectsChange} isEditable={isEditable} />
        <Contact data={data.contact} onChange={handleContactChange} isEditable={isEditable} />
        
        <footer className="bg-primary text-primary-foreground py-12">
          <div className="section-container text-center">
            <p className="text-lg">&copy; 2025 My Portfolio. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
