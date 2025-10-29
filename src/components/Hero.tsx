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
    <section className="min-h-[60vh] flex items-center justify-center pt-32 pb-12   ">
      <div className=" text-center max-w-3xl  ">
        <div className="mb-8 flex justify-center ">
          {data.image ? (
            <EditableImage
              src={data.image}
              alt="Profile"
              onChange={(value) => onChange("image", value)}
              className="w-32 h-32 rounded-full object-cover border-4 border-accent/20 hover-glow"
              isEditable={isEditable}
            />
          ) : isEditable && (
            <div>
              <span className="text-sm text-muted-foreground">Add Photo</span>
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-center gap-2">


          <span className="inline-block px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
            Featured work
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          <EditableText
            value={data.title}
            onChange={(value) => onChange("title", value)}
            isEditable={isEditable}
            className="inline-block"
          />
        </h1>

        <p className="text-base sm:text-lg mb-8 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          <EditableText
            value={data.subtitle}
            onChange={(value) => onChange("subtitle", value)}
            multiline
            isEditable={isEditable}
          />
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent/60" />
          <p className="text-sm text-muted-foreground">
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
