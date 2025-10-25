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
      <section className="section-container pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Work</h1>
          <p className="text-lg text-muted-foreground mb-12">
            A selection of projects I've worked on.
          </p>

          {isEditable && (
            <Button onClick={handleAddProject} className="mb-8">
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="projects" isDropDisabled={!isEditable}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-16"
                >
                  {sortedProjects.map((project, index) => (
                    <Draggable
                      key={project.id}
                      draggableId={project.id}
                      index={index}
                      isDragDisabled={!isEditable}
                    >
                      {(provided) => (
                        <article
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          id={project.id}
                          className="group relative"
                        >
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

                          <div className="mb-6 rounded-2xl overflow-hidden card-elevated">
                            <EditableImage
                              src={project.image}
                              alt={project.title}
                              onChange={(value) =>
                                handleProjectChange(project.id, "image", value)
                              }
                              className="w-full h-auto"
                              isEditable={isEditable}
                            />
                          </div>

                          <h2 className="text-3xl font-bold mb-4">
                            <EditableText
                              value={project.title}
                              onChange={(value) =>
                                handleProjectChange(project.id, "title", value)
                              }
                              isEditable={isEditable}
                            />
                          </h2>

                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0" />
                            <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                          </div>

                          <p className="text-lg text-muted-foreground mb-6">
                            <EditableText
                              value={project.description}
                              onChange={(value) =>
                                handleProjectChange(project.id, "description", value)
                              }
                              multiline
                              isEditable={isEditable}
                            />
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </article>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </section>
    </div>
  );
};
