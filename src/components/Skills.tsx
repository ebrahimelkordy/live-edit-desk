import { Skill } from "@/types/portfolio";
import { EditableText } from "./EditableText";
import { Button } from "./ui/button";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface SkillsProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  isEditable?: boolean;
}

export const Skills = ({ skills, onChange, isEditable = false }: SkillsProps) => {
  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "New Skill",
      icon: "💡",
      description: "Describe your skill here",
      order: skills.length,
    };
    onChange([...skills, newSkill]);
  };

  const handleDeleteSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const handleSkillChange = (id: string, field: keyof Skill, value: string) => {
    onChange(
      skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(skills);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reordered = items.map((item, index) => ({ ...item, order: index }));
    onChange(reordered);
  };

  const sortedSkills = [...skills].sort((a, b) => a.order - b.order);

  return (
    <section id="skills" className="section-container">
      <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Skills & Expertise</h2>
      
      {isEditable ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="skills">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
              >
                {sortedSkills.map((skill, index) => (
                  <Draggable key={skill.id} draggableId={skill.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="card-elevated p-6 bg-card group"
                      >
                        <div className="flex items-start gap-2 mb-4">
                          <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="text-4xl mb-2">
                              <EditableText
                                value={skill.icon}
                                onChange={(value) => handleSkillChange(skill.id, "icon", value)}
                                isEditable={isEditable}
                              />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                              <EditableText
                                value={skill.name}
                                onChange={(value) => handleSkillChange(skill.id, "name", value)}
                                isEditable={isEditable}
                              />
                            </h3>
                            <p className="text-muted-foreground">
                              <EditableText
                                value={skill.description}
                                onChange={(value) => handleSkillChange(skill.id, "description", value)}
                                multiline
                                isEditable={isEditable}
                              />
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sortedSkills.map((skill) => (
            <div key={skill.id} className="card-elevated p-6 bg-card">
              <div className="text-4xl mb-4">{skill.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
              <p className="text-muted-foreground">{skill.description}</p>
            </div>
          ))}
        </div>
      )}

      {isEditable && (
        <div className="mt-8 text-center">
          <Button onClick={handleAddSkill} variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add New Skill
          </Button>
        </div>
      )}
    </section>
  );
};
