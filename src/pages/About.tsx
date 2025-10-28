import { useState } from "react";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { ExperienceList } from "@/components/ExperienceList";
import { StudiesList } from "@/components/StudiesList";
import { loadPortfolioData, savePortfolioData } from "@/lib/storage";
import type { Skill, Experience, Study } from "@/types/portfolio";

interface AboutPageProps {
  isEditable?: boolean;
}

export const AboutPage = ({ isEditable = false }: AboutPageProps) => {
  console.log("AboutPage isEditable:", isEditable);
  const [data, setData] = useState(loadPortfolioData());

  const handleAboutChange = (field: string, value: string) => {
    const updated = {
      ...data,
      about: { ...data.about, [field]: value },
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleSkillsChange = (skills: Skill[]) => {
    const updated = { ...data, skills };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleExperiencesChange = (items: Experience[]) => {
    const updated = { ...data, about: { ...data.about, experiences: items } };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleStudiesChange = (items: Study[]) => {
    const updated = { ...data, about: { ...data.about, studies: items } };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  return (
    <div className="min-h-screen">
      {/* Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Introduction</p>
      </div>
      <About data={data.about} onChange={handleAboutChange} isEditable={isEditable} />

      {/* Work Experience */}
      <section className="section-container">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Work Experience</h2>
        <ExperienceList items={data.about.experiences || []} onChange={handleExperiencesChange} isEditable={isEditable} />
      </section>

      {/* Studies */}
      <section className="section-container bg-[hsl(var(--section-bg))]">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Studies</h2>
        <StudiesList items={data.about.studies || []} onChange={handleStudiesChange} isEditable={isEditable} />
      </section>

      {/* Technical skills */}
      <section className="section-container">
        <Skills skills={data.skills} onChange={handleSkillsChange} isEditable={isEditable} title="Technical skills" />
      </section>
    </div>
  );
};
