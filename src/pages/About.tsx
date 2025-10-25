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
      <section className="section-container pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Avatar and Title */}
          <div className="flex items-center gap-6 mb-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0" />
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                <EditableText
                  value={data.about.title}
                  onChange={(value) => handleChange("title", value)}
                  isEditable={isEditable}
                />
              </h1>
              <p className="text-muted-foreground">Design Engineer</p>
            </div>
          </div>

          {/* About Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
              <EditableText
                value={data.about.description}
                onChange={(value) => handleChange("description", value)}
                multiline
                isEditable={isEditable}
              />
            </div>
          </div>

          {/* Image if available */}
          {data.about.image && (
            <div className="mt-12 rounded-2xl overflow-hidden card-elevated">
              <EditableImage
                src={data.about.image}
                alt="About"
                onChange={(value) => handleChange("image", value)}
                className="w-full h-auto"
                isEditable={isEditable}
              />
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-16 pt-16 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
            <div className="grid sm:grid-cols-3 gap-6">
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
