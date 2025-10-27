import { useState } from "react";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
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
    <div className="min-h-screen">
      <section className="section-container bg-[hsl(var(--section-bg))] pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">
            <EditableText
              value={data.about.title}
              onChange={(value) => handleChange("title", value)}
              isEditable={isEditable}
            />
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {data.about.image && (
              <div className="order-2 md:order-1">
                <EditableImage
                  src={data.about.image}
                  alt="About"
                  onChange={(value) => handleChange("image", value)}
                  className="rounded-lg w-full card-elevated"
                  isEditable={isEditable}
                />
              </div>
            )}
            <div className={data.about.image ? "order-1 md:order-2" : "col-span-2"}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                <EditableText
                  value={data.about.description}
                  onChange={(value) => handleChange("description", value)}
                  multiline
                  isEditable={isEditable}
                />
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-16 pt-16 border-t border-border text-center">
            <h3 className="text-2xl font-bold mb-8">Get in touch</h3>
            <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Email</p>
                <p className="font-medium">{data.contact.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Phone</p>
                <p className="font-medium">{data.contact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Location</p>
                <p className="font-medium">{data.contact.location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
