import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import { Button } from "./ui/button";

interface HeroProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    image?: string;
  };
  onChange: (field: string, value: string) => void;
  isEditable?: boolean;
}

export const Hero = ({ data, onChange, isEditable = false }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))] text-white">
      <div className="section-container text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-4">
            <EditableText
              value={data.subtitle}
              onChange={(value) => onChange("subtitle", value)}
              className="text-white/90"
              isEditable={isEditable}
            />
          </h2>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <EditableText
              value={data.title}
              onChange={(value) => onChange("title", value)}
              className="text-white"
              isEditable={isEditable}
            />
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            <EditableText
              value={data.description}
              onChange={(value) => onChange("description", value)}
              className="text-white/80"
              multiline
              isEditable={isEditable}
            />
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            asChild
          >
            <a href={data.ctaLink}>
              <EditableText
                value={data.ctaText}
                onChange={(value) => onChange("ctaText", value)}
                isEditable={isEditable}
              />
            </a>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};
