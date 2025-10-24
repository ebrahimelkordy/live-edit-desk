import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import { Button } from "./ui/button";

interface HeroProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
  };
  onChange: (field: string, value: string) => void;
  isEditable?: boolean;
}

export const Hero = ({ data, onChange, isEditable = false }: HeroProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16">
      <div className="section-container text-center max-w-4xl">
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium">
            Portfolio
          </span>
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-foreground text-sm font-medium">
            Featured work
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <EditableText
            value={data.title}
            onChange={(value) => onChange("title", value)}
            isEditable={isEditable}
            className="inline-block"
          />
        </h1>
        
        <p className="text-lg sm:text-xl mb-6 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          <EditableText
            value={data.subtitle}
            onChange={(value) => onChange("subtitle", value)}
            multiline
            isEditable={isEditable}
          />
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-accent/20" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground">
                <EditableText
                  value={data.description}
                  onChange={(value) => onChange("description", value)}
                  isEditable={isEditable}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
