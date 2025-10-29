import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Trash2, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { loadPortfolioData, savePortfolioData, defaultPortfolioData } from "@/lib/storage";
import type { Project } from "@/types/portfolio";
import Masonry from "react-masonry-css";
import { SkeletonCard } from "@/components/SkeletonCard";

interface WorkProps {
  isEditable?: boolean;
}

export const Work = ({ isEditable = false }: WorkProps) => {
  const navigate = useNavigate();
  const [data, setData] = useState(defaultPortfolioData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loaded = await loadPortfolioData();
        setData(loaded);
      } catch (error) {
        console.error("Failed to load portfolio data:", error);
        // Keep default data if loading fails
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
      detailedDescription: "Detailed description of the project with more information about the technologies used, challenges faced, and solutions implemented.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      images: [
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800"
      ],
      date: new Date().toISOString().split('T')[0],
      tags: ["Design", "Development"],
      category: "Web Development",
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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
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
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => navigate(`/dashboard/work/${project.id}`)}
                                  title="View Project"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-4 right-16 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleDeleteProject(project.id)}
                                  title="Delete Project"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
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
                            <div className="mb-2">
                              <EditableText
                                value={project.category || ""}
                                onChange={(value) => handleProjectChange(project.id, "category", value)}
                                isEditable={isEditable}
                                placeholder="Category (optional)"
                                className="text-sm text-muted-foreground font-medium"
                              />
                            </div>
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
                            {project.link && (
                              <div className="mb-4">
                                <EditableText
                                  value={project.link}
                                  onChange={(value) => handleProjectChange(project.id, "link", value)}
                                  isEditable={isEditable}
                                  placeholder="Project link (optional)"
                                  className="text-accent underline hover:text-accent/80"
                                />
                              </div>
                            )}
                            {!project.link && isEditable && (
                              <div className="mb-4">
                                <EditableText
                                  value=""
                                  onChange={(value) => handleProjectChange(project.id, "link", value)}
                                  isEditable={isEditable}
                                  placeholder="Add project link (optional)"
                                  className="text-accent underline hover:text-accent/80"
                                />
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {project.tags.map((tag, i) => (
                                <div key={i} className="flex items-center gap-1">
                                  <EditableText
                                    value={tag}
                                    onChange={(value) => {
                                      const newTags = [...project.tags];
                                      newTags[i] = value;
                                      handleProjectChange(project.id, "tags", newTags);
                                    }}
                                    isEditable={isEditable}
                                    className="inline-block"
                                  />
                                  {isEditable && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newTags = project.tags.filter((_, index) => index !== i);
                                        handleProjectChange(project.id, "tags", newTags);
                                      }}
                                      className="h-5 w-5 p-0 text-destructive hover:text-destructive/80"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              {isEditable && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newTags = [...project.tags, "New Tag"];
                                    handleProjectChange(project.id, "tags", newTags);
                                  }}
                                  className="h-6 px-2 text-xs"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              )}
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
        ) : isLoading ? (
          <SkeletonCard count={6} />
        ) : (
          <Masonry
            breakpointCols={{
              default: 3,
              1024: 3,
              768: 2,
              640: 1
            }}
            className="flex -ml-8 w-auto max-w-7xl mx-auto"
            columnClassName="pl-8 bg-clip-padding"
          >
            {sortedProjects.map((project) => (
              <div key={project.id} className="card-elevated bg-card overflow-hidden mb-8 cursor-pointer" onClick={() => navigate(`/work/${project.id}`)}>
                <img src={project.image} alt={project.title} className="w-full object-cover" />
                <div className="p-6">
                  {project.category && (
                    <div className="mb-2">
                      <span className="text-sm text-muted-foreground font-medium">{project.category}</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  {project.link && (
                    <div className="mb-4">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline hover:text-accent/80 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Project →
                      </a>
                    </div>
                  )}
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
          </Masonry>
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
