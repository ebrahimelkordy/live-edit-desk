import { useState } from "react";
import { About } from "@/components/About";
import { loadPortfolioData, savePortfolioData } from "@/lib/storage";

interface AboutPageProps {
  isEditable?: boolean;
}

export const AboutPage = ({ isEditable = false }: AboutPageProps) => {
  const [data, setData] = useState(loadPortfolioData());

  const handleChange = (field: string, value: string) => {
    const updated = {
      ...data,
      about: { ...data.about, [field]: value },
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <About data={data.about} onChange={handleChange} isEditable={isEditable} />
    </div>
  );
};
