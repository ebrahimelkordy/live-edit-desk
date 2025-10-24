import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";

interface AboutProps {
  data: {
    title: string;
    description: string;
    image?: string;
  };
  onChange: (field: string, value: string) => void;
  isEditable?: boolean;
}

export const About = ({ data, onChange, isEditable = false }: AboutProps) => {
  return (
    <section id="about" className="section-container bg-[hsl(var(--section-bg))]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">
          <EditableText
            value={data.title}
            onChange={(value) => onChange("title", value)}
            isEditable={isEditable}
          />
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {data.image && (
            <div className="order-2 md:order-1">
              <EditableImage
                src={data.image}
                alt="About"
                onChange={(value) => onChange("image", value)}
                className="rounded-lg w-full card-elevated"
                isEditable={isEditable}
              />
            </div>
          )}
          <div className={data.image ? "order-1 md:order-2" : "col-span-2"}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <EditableText
                value={data.description}
                onChange={(value) => onChange("description", value)}
                multiline
                isEditable={isEditable}
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
