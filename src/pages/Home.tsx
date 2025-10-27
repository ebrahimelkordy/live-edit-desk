import { useState } from "react";
import { EditableText } from "@/components/EditableText";
import { loadPortfolioData, savePortfolioData } from "@/lib/storage";

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

  return (
    <div className="min-h-screen">
      <section className="min-h-[60vh] flex items-center justify-center pt-32 pb-12">
        <div className="section-container text-center max-w-3xl">
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="inline-block px-3 py-1.5 rounded-full bg-accent text-white text-xs font-medium">
              Once UI
            </span>
            <span className="inline-block px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
              Featured work
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            <EditableText
              value={data.hero.title}
              onChange={(value) => handleHeroChange("title", value)}
              isEditable={isEditable}
              className="inline-block"
            />
          </h1>
          
          <p className="text-base sm:text-lg mb-8 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            <EditableText
              value={data.hero.subtitle}
              onChange={(value) => handleHeroChange("subtitle", value)}
              multiline
              isEditable={isEditable}
            />
          </p>
          
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent/60" />
            <p className="text-sm text-muted-foreground">
              <EditableText
                value={data.hero.description}
                onChange={(value) => handleHeroChange("description", value)}
                isEditable={isEditable}
              />
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
