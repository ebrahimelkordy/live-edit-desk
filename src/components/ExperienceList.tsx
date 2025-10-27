import { EditableText } from "./EditableText";
import { Experience } from "@/types/portfolio";

interface ExperienceListProps {
  items: Experience[];
  onChange: (items: Experience[]) => void;
  isEditable?: boolean;
}

export const ExperienceList = ({ items, onChange, isEditable = false }: ExperienceListProps) => {
  const sorted = [...items].sort((a, b) => a.order - b.order);

  const updateItem = (id: string, field: keyof Experience, value: string) => {
    onChange(sorted.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {sorted.map((exp) => (
        <article key={exp.id} className="card-elevated p-6 bg-card">
          <h3 className="text-xl font-semibold mb-1">
            <EditableText
              value={exp.role}
              onChange={(v) => updateItem(exp.id, "role", v)}
              isEditable={isEditable}
            />
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            <EditableText
              value={`${exp.company} • ${exp.period}`}
              onChange={(v) => {
                // naive split: keep full string into description-like field if edited; for controlled fields, better add separate editors
                updateItem(exp.id, "period", v);
              }}
              isEditable={isEditable}
            />
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText
              value={exp.description}
              onChange={(v) => updateItem(exp.id, "description", v)}
              multiline
              isEditable={isEditable}
            />
          </p>
        </article>
      ))}
    </div>
  );
}

