import { EditableText } from "./EditableText";
import { Experience } from "@/types/portfolio";
import { Button } from "./ui/button";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

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

  const handleAdd = () => {
    const newItem: Experience = {
      id: Date.now().toString(),
      role: "New Role",
      company: "Company",
      period: "2020 — 2024",
      description: "Describe your role",
      order: sorted.length,
    };
    onChange([...sorted, newItem]);
  };

  const handleDelete = (id: string) => {
    const remaining = sorted.filter((it) => it.id !== id).map((it, idx) => ({ ...it, order: idx }));
    onChange(remaining);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const itemsArr = Array.from(sorted);
    const [reordered] = itemsArr.splice(result.source.index, 1);
    itemsArr.splice(result.destination.index, 0, reordered);
    onChange(itemsArr.map((it, idx) => ({ ...it, order: idx })));
  };

  if (isEditable) {
    return (
      <>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="experience">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {sorted.map((exp, index) => (
                  <Draggable key={exp.id} draggableId={exp.id} index={index}>
                    {(dragProvided) => (
                      <article ref={dragProvided.innerRef} {...dragProvided.draggableProps} className="card-elevated p-6 bg-card group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2" {...dragProvided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Drag</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(exp.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <h3 className="text-xl font-semibold mb-1">
                          <EditableText value={exp.role} onChange={(v) => updateItem(exp.id, "role", v)} isEditable={isEditable} />
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          <EditableText
                            value={`${exp.company} • ${exp.period}`}
                            onChange={(v) => {
                              updateItem(exp.id, "period", v);
                            }}
                            isEditable={isEditable}
                          />
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          <EditableText value={exp.description} onChange={(v) => updateItem(exp.id, "description", v)} multiline isEditable={isEditable} />
                        </p>
                      </article>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="mt-8 text-center">
          <Button onClick={handleAdd} variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {sorted.map((exp) => (
        <article key={exp.id} className="card-elevated p-6 bg-card">
          <h3 className="text-xl font-semibold mb-1">
            <EditableText value={exp.role} onChange={(v) => updateItem(exp.id, "role", v)} isEditable={isEditable} />
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            <EditableText
              value={`${exp.company} • ${exp.period}`}
              onChange={(v) => {
                updateItem(exp.id, "period", v);
              }}
              isEditable={isEditable}
            />
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText value={exp.description} onChange={(v) => updateItem(exp.id, "description", v)} multiline isEditable={isEditable} />
          </p>
        </article>
      ))}
    </div>
  );
};