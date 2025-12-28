import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import { Button } from "./ui/button";

interface HeroProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    image?: string;
  };
  onChange: (field: string, value: string) => void;
  isEditable?: boolean;
}

export const Hero = ({ data, onChange, isEditable = false }: HeroProps) => {
  return (
    <section className="min-h-[70vh] flex items-center justify-center pt-32 pb-12 relative overflow-hidden">
      <div className=" text-center max-w-3xl relative z-10">
        <div className="mb-8 flex justify-center">
          {data.image ? (
            <EditableImage
              src={data.image}
              alt="Profile"
              onChange={(value) => onChange("image", value)}
              className="w-36 h-36 rounded-full object-cover border-4 border-accent/30 hover-glow shadow-lg"
              isEditable={isEditable}
            />
          ) : isEditable && (
            <div className="w-36 h-36 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">Add Photo</span>
            </div>
          )}
        </div>


        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          <EditableText
            value={data.title}
            onChange={(value) => onChange("title", value)}
            isEditable={isEditable}
            className="inline-block"
          />
        </h1>

        <p className="text-lg sm:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
          <EditableText
            value={data.subtitle}
            onChange={(value) => onChange("subtitle", value)}
            multiline
            isEditable={isEditable}
          />
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
            </div>
          </div>
          <p className="text-base text-muted-foreground max-w-md">
            <EditableText
              value={data.description}
              onChange={(value) => onChange("description", value)}
              isEditable={isEditable}
            />
          </p>
        </div>
      </div>
    </section>
  );
};
