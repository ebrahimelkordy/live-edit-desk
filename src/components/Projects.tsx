import { Project } from "@/types/portfolio";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface ProjectsProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
  isEditable?: boolean;
}

export const Projects = ({ projects, onChange, isEditable = false }: ProjectsProps) => {
  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "New Project",
      description: "Project description here",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      tags: ["Tag1", "Tag2"],
      order: projects.length,
    };
    onChange([...projects, newProject]);
  };

  const handleDeleteProject = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  const handleProjectChange = (id: string, field: keyof Project, value: any) => {
    onChange(
      projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reordered = items.map((item, index) => ({ ...item, order: index }));
    onChange(reordered);
  };

  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

  return (
    <section id="projects" className="section-container bg-[hsl(var(--section-bg))]">
      <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Featured Projects</h2>

      {isEditable ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="projects">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
              >
                {sortedProjects.map((project, index) => (
                  <Draggable key={project.id} draggableId={project.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="card-elevated bg-card overflow-hidden group"
                      >
                        <div className="flex items-center gap-2 p-4 border-b">
                          <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            className="ml-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <EditableImage
                          src={project.image}
                          alt={project.title}
                          onChange={(value) => handleProjectChange(project.id, "image", value)}
                          className="w-full h-64 object-cover"
                          isEditable={isEditable}
                        />
                        <div className="p-6">
                          <h3 className="text-2xl font-semibold mb-3">
                            <EditableText
                              value={project.title}
                              onChange={(value) => handleProjectChange(project.id, "title", value)}
                              isEditable={isEditable}
                            />
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            <EditableText
                              value={project.description}
                              onChange={(value) => handleProjectChange(project.id, "description", value)}
                              multiline
                              isEditable={isEditable}
                            />
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
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
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {sortedProjects.map((project) => (
            <div key={project.id} className="card-elevated bg-card overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditable && (
        <div className="mt-8 text-center">
          <Button onClick={handleAddProject} variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add New Project
          </Button>
        </div>
      )}
    </section>
  );
};
