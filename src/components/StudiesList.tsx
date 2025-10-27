import { EditableText } from "./EditableText";
import { Study } from "@/types/portfolio";

interface StudiesListProps {
  items: Study[];
  onChange: (items: Study[]) => void;
  isEditable?: boolean;
}

export const StudiesList = ({ items, onChange, isEditable = false }: StudiesListProps) => {
  const sorted = [...items].sort((a, b) => a.order - b.order);

  const updateItem = (id: string, field: keyof Study, value: string) => {
    onChange(sorted.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {sorted.map((edu) => (
        <article key={edu.id} className="card-elevated p-6 bg-card">
          <h3 className="text-xl font-semibold mb-1">
            <EditableText
              value={edu.degree}
              onChange={(v) => updateItem(edu.id, "degree", v)}
              isEditable={isEditable}
            />
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            <EditableText
              value={`${edu.institution} • ${edu.period}`}
              onChange={(v) => {
                updateItem(edu.id, "period", v);
              }}
              isEditable={isEditable}
            />
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText
              value={edu.description}
              onChange={(v) => updateItem(edu.id, "description", v)}
              multiline
              isEditable={isEditable}
            />
          </p>
        </article>
      ))}
    </div>
  );
}
