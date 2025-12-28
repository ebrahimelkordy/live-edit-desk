import { Project } from "@/types/portfolio";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, GripVertical, Trash2, ExternalLink } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Masonry from "react-masonry-css";
import { SkeletonCard } from "./SkeletonCard";
import { useNavigate } from "react-router-dom";

interface ProjectsProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
  isEditable?: boolean;
  isLoading?: boolean;
}

export const Projects = ({ projects, onChange, isEditable = false, isLoading = false }: ProjectsProps) => {
  const navigate = useNavigate();
  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "New Project",
      description: "Project description here",
      detailedDescription: "Detailed description of the project with more information about the technologies used, challenges faced, and solutions implemented.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
      ],
      date: new Date().toISOString().split('T')[0],
      tags: ["Tag1", "Tag2"],
      category: "Web Development",
      order: projects.length,
    };
    onChange([...projects, newProject]);
  };

  const handleDeleteProject = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  const handleProjectChange = (id: string, field: keyof Project, value: any) => {
    let normalizedValue = value;
    if ((field === "link" || field === "github" || field === "liveDemo") && value) {
      normalizedValue = value.trim();
      if (!normalizedValue.startsWith("http://") && !normalizedValue.startsWith("https://")) {
        normalizedValue = `https://${normalizedValue}`;
      }
    }
    onChange(
      projects.map((project) =>
        project.id === id ? { ...project, [field]: normalizedValue } : project
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
                        className="card-standard overflow-hidden group"
                      >
                        <div className="flex items-center gap-2 p-4 border-b">
                          <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/dashboard/work/${project.id}`)}
                            className="ml-auto mr-2"
                            title="View Project"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            className=""
                            title="Delete Project"
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
                          <div className="mb-4">
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
                          <div className="mb-4 space-y-2">
                            {project.link && (
                              <EditableText
                                value={project.link}
                                onChange={(value) => handleProjectChange(project.id, "link", value)}
                                isEditable={isEditable}
                                placeholder="Project link (optional)"
                                className="text-accent underline hover:text-accent/80"
                                isLink={true}
                              />
                            )}
                            {!project.link && isEditable && (
                              <EditableText
                                value=""
                                onChange={(value) => handleProjectChange(project.id, "link", value)}
                                isEditable={isEditable}
                                placeholder="Add project link (optional)"
                                className="text-accent underline hover:text-accent/80"
                                isLink={true}
                              />
                            )}
                            {project.github && (
                              <EditableText
                                value={project.github}
                                onChange={(value) => handleProjectChange(project.id, "github", value)}
                                isEditable={isEditable}
                                placeholder="GitHub link (optional)"
                                className="text-accent underline hover:text-accent/80"
                                isLink={true}
                              />
                            )}
                            {!project.github && isEditable && (
                              <EditableText
                                value=""
                                onChange={(value) => handleProjectChange(project.id, "github", value)}
                                isEditable={isEditable}
                                placeholder="Add GitHub link (optional)"
                                className="text-accent underline hover:text-accent/80"
                                isLink={true}
                              />
                            )}
                            {project.liveDemo && (
                              <EditableText
                                value={project.liveDemo}
                                onChange={(value) => handleProjectChange(project.id, "liveDemo", value)}
                                isEditable={isEditable}
                                placeholder="Live demo link (optional)"
                                className="text-accent underline hover:text-accent/80"
                                isLink={true}
                              />
                            )}
                            {!project.liveDemo && isEditable && (
                              <EditableText
                                value=""
                                onChange={(value) => handleProjectChange(project.id, "liveDemo", value)}
                                isEditable={isEditable}
                                placeholder="Add live demo link (optional)"
                                className="text-accent underline hover:text-accent/80"
                                isLink={true}
                              />
                            )}
                          </div>
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
                          {isEditable && (
                            <div className="mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/work/${project.id}`)}
                                className="w-full"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Project
                              </Button>
                            </div>
                          )}
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
            <div key={project.id} className="card-standard overflow-hidden mb-8 cursor-pointer" onClick={() => navigate(`/work/${project.id}`)}>
              <img src={project.image} alt={project.title} className="w-full object-cover" />
              <div className="p-6">
                {project.category && (
                  <div className="mb-2">
                    <span className="text-sm text-muted-foreground font-medium">{project.category}</span>
                  </div>
                )}
                <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline hover:text-accent/80 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Project →
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline hover:text-accent/80 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub →
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline hover:text-accent/80 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
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
  );
};
