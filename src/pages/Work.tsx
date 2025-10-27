import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { loadPortfolioData, savePortfolioData } from "@/lib/storage";
import type { Project } from "@/types/portfolio";

interface WorkProps {
  isEditable?: boolean;
}

export const Work = ({ isEditable = false }: WorkProps) => {
  const [data, setData] = useState(loadPortfolioData());

  const handleProjectChange = (id: string, field: keyof Project, value: any) => {
    const updated = {
      ...data,
      projects: data.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: "New Project",
      description: "Project description here...",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      tags: ["Design", "Development"],
      order: data.projects.length,
    };
    const updated = { ...data, projects: [...data.projects, newProject] };
    setData(updated);
    savePortfolioData(updated);
  };

  const handleDeleteProject = (id: string) => {
    const updated = {
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    };
    setData(updated);
    savePortfolioData(updated);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(data.projects);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    const reorderedWithOrder = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    const updated = { ...data, projects: reorderedWithOrder };
    setData(updated);
    savePortfolioData(updated);
  };

  const sortedProjects = [...data.projects].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen">
      <section className="section-container bg-[hsl(var(--section-bg))] pt-32 pb-20">
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
                          <div className="relative">
                            {isEditable && (
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                            <EditableImage
                              src={project.image}
                              alt={project.title}
                              onChange={(value) => handleProjectChange(project.id, "image", value)}
                              className="w-full h-64 object-cover"
                              isEditable={isEditable}
                            />
                          </div>
                          <div className="p-6" {...provided.dragHandleProps}>
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
                                <span key={i} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                                  {tag}
                                </span>
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
                      <span key={i} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                        {tag}
                      </span>
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
    </div>
  );
};
