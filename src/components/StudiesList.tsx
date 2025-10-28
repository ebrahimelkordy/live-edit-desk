import { EditableText } from "./EditableText";
import { EditableImageUpload } from "./EditableImageUpload";
import { Study } from "@/types/portfolio";
import { Button } from "./ui/button";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

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

  const handleAdd = () => {
    const newItem: Study = {
      id: Date.now().toString(),
      degree: "New Degree",
      institution: "Institution",
      period: "2020 — 2024",
      description: "Describe your study",
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
          <Droppable droppableId="studies">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {sorted.map((edu, index) => (
                  <Draggable key={edu.id} draggableId={edu.id} index={index}>
                    {(dragProvided) => (
                      <article ref={dragProvided.innerRef} {...dragProvided.draggableProps} className="card-elevated p-6 bg-card group hover-lift">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2" {...dragProvided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Drag</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(edu.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <EditableImageUpload
                          value={edu.image}
                          onChange={(value) => updateItem(edu.id, "image", value)}
                          label="Upload institution logo"
                          isEditable={isEditable}
                          className="w-full rounded-lg mb-3"
                        />
                        <h3 className="text-xl font-semibold mb-1">
                          <EditableText value={edu.degree} onChange={(v) => updateItem(edu.id, "degree", v)} isEditable={isEditable} />
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
                          <EditableText value={edu.description} onChange={(v) => updateItem(edu.id, "description", v)} multiline isEditable={isEditable} />
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
            <Plus className="mr-2 h-4 w-4" /> Add Study
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {sorted.map((edu) => (
        <article key={edu.id} className="card-elevated p-6 bg-card hover-lift">
          {edu.image && (
            <img src={edu.image} alt={edu.institution} className="w-full h-32 object-cover rounded-lg mb-3" />
          )}
          <h3 className="text-xl font-semibold mb-1">
            <EditableText value={edu.degree} onChange={(v) => updateItem(edu.id, "degree", v)} isEditable={isEditable} />
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
            <EditableText value={edu.description} onChange={(v) => updateItem(edu.id, "description", v)} multiline isEditable={isEditable} />
          </p>
        </article>
      ))}
    </div>
  );
};