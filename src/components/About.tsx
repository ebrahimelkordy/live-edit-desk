import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { EditableFileUpload } from "./EditableFileUpload";

interface AboutProps {
  data: {
    title: string;
    description: string;
    image?: string;
    cv?: string;
  };
  onChange: (field: string, value: string) => void;
  isEditable?: boolean;
}

export const About = ({ data, onChange, isEditable = false }: AboutProps) => {
  return (
    <section id="about" className="section-container">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-foreground">
          <EditableText
            value={data.title}
            onChange={(value) => onChange("title", value)}
            isEditable={isEditable}
            className="text-foreground"
          />
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {data.image && (
            <div className="order-2 md:order-1 flex justify-center">
              <EditableImage
                src={data.image}
                alt="About"
                onChange={(value) => onChange("image", value)}
                className="rounded-2xl w-full max-w-md object-cover border border-border/40 shadow-lg"
                isEditable={isEditable}
              />
            </div>
          )}
          <div className={data.image ? "order-1 md:order-2" : "col-span-2"}>
            <div className="card-elevated p-8 rounded-2xl border border-border/40 shadow-lg">
              <p className="text-lg text-foreground leading-relaxed">
                <EditableText
                  value={data.description}
                  onChange={(value) => onChange("description", value)}
                  multiline
                  isEditable={isEditable}
                />
              </p>
              <div className="mt-6 flex justify-start">
                {data.cv && (
                  isEditable ? (
                    <EditableText
                      value={data.cv}
                      onChange={(value) => onChange("cv", value)}
                      isEditable={isEditable}
                      placeholder="CV file URL"
                      className="text-accent underline hover:text-accent/80"
                    />
                  ) : (
                    <Button asChild variant="outline" className="gap-2">
                      <a href={data.cv} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                        Download CV
                      </a>
                    </Button>
                  )
                )}
                {!data.cv && isEditable && (
                  <EditableText
                    value=""
                    onChange={(value) => onChange("cv", value)}
                    isEditable={isEditable}
                    placeholder="Add CV file URL"
                    className="text-accent underline hover:text-accent/80"
                  />
                )}
                {isEditable && (
                  <div className="mt-3">
                    <EditableFileUpload
                      value={data.cv}
                      onChange={(url) => onChange("cv", url)}
                      isEditable={isEditable}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};