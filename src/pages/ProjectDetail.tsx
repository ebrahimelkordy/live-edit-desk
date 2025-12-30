import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Project } from "@/types/portfolio";
import { loadPortfolioData, savePortfolioData } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, Globe, Edit, Plus, Trash2 } from "lucide-react";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";

interface ProjectDetailProps {
  isEditable?: boolean;
}

export const ProjectDetail = ({ isEditable = false }: ProjectDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await loadPortfolioData();
        const foundProject = data.projects.find(p => p.id === id);
        setProject(foundProject || null);
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleProjectChange = (field: keyof Project, value: any) => {
    if (!project) return;

    const updatedProject = { ...project, [field]: value };
    setProject(updatedProject);

    // Update in storage
    const updateStorage = async () => {
      try {
        const data = await loadPortfolioData();
        const updatedProjects = data.projects.map(p =>
          p.id === project.id ? updatedProject : p
        );
        await savePortfolioData({ ...data, projects: updatedProjects });
      } catch (error) {
        console.error("Failed to save project:", error);
      }
    };

    if (isEditable) updateStorage();
  };

  const handleAddCategoryImage = () => {
    if (!project) return;
    const newImages = [...(project.images || []), "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"];
    handleProjectChange("images", newImages);
  };

  const handleRemoveCategoryImage = (index: number) => {
    if (!project || !project.images) return;
    const newImages = project.images.filter((_, i) => i !== index);
    handleProjectChange("images", newImages);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          <SkeletonCard count={1} />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Button onClick={() => navigate('/work')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/work')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
          {isEditable && (
            <Button
              variant="outline"
              onClick={() => navigate(`/dashboard/work/${project.id}/edit`)}
              className="mb-8"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
          )}
        </div>
      </div>

      {/* Project Header */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <EditableText
                value={project.title}
                onChange={(value) => handleProjectChange("title", value)}
                isEditable={isEditable}
              />
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              <EditableText
                value={project.description}
                onChange={(value) => handleProjectChange("description", value)}
                multiline
                isEditable={isEditable}
              />
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
              <span>📅 </span>
              <EditableText
                value={project.date}
                onChange={(value) => handleProjectChange("date", value)}
                isEditable={isEditable}
                className="text-muted-foreground"
              />
              {project.endDate && (
                <>
                  <span>-</span>
                  <EditableText
                    value={project.endDate}
                    onChange={(value) => handleProjectChange("endDate", value)}
                    isEditable={isEditable}
                    className="text-muted-foreground"
                  />
                </>
              )}
              {!project.endDate && isEditable && (
                <>
                  <span>-</span>
                  <EditableText
                    value=""
                    onChange={(value) => handleProjectChange("endDate", value)}
                    isEditable={isEditable}
                    placeholder="End date"
                    className="text-muted-foreground"
                  />
                </>
              )}
              {project.category && (
                <EditableText
                  value={project.category}
                  onChange={(value) => handleProjectChange("category", value)}
                  isEditable={isEditable}
                  className="text-accent font-medium"
                />
              )}
              {!project.category && isEditable && (
                <EditableText
                  value=""
                  onChange={(value) => handleProjectChange("category", value)}
                  isEditable={isEditable}
                  placeholder="Add category"
                  className="text-accent font-medium"
                />
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {project.tags.map((tag, i) => (
                <div key={i} className="flex items-center gap-1">
                  <EditableText
                    value={tag}
                    onChange={(value) => {
                      const newTags = [...project.tags];
                      newTags[i] = value;
                      handleProjectChange("tags", newTags);
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
                        handleProjectChange("tags", newTags);
                      }}
                      className="h-5 w-5 p-0 text-destructive hover:text-destructive/80"
                    >
                      ×
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
                    handleProjectChange("tags", newTags);
                  }}
                  className="h-6 px-2 text-xs"
                >
                  +
                </Button>
              )}
            </div>
            <div className="flex justify-center gap-4">
              {project.link && (
                isEditable ? (
                  <EditableText
                    value={project.link}
                    onChange={(value) => handleProjectChange("link", value)}
                    isEditable={isEditable}
                    placeholder="Project link (optional)"
                    className="text-accent underline hover:text-accent/80"
                    isLink={true}
                  />
                ) : (
                  <Button asChild variant="outline">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Project
                    </a>
                  </Button>
                )
              )}
              {!project.link && isEditable && (
                <EditableText
                  value=""
                  onChange={(value) => handleProjectChange("link", value)}
                  isEditable={isEditable}
                  placeholder="Add project link (optional)"
                  className="text-accent underline hover:text-accent/80"
                  isLink={true}
                />
              )}
              {project.github && (
                <EditableText
                  value={project.github}
                  onChange={(value) => handleProjectChange("github", value)}
                  isEditable={isEditable}
                  placeholder="GitHub link (optional)"
                  className="text-accent underline hover:text-accent/80"
                  isLink={true}
                />
              )}
              {!project.github && isEditable && (
                <EditableText
                  value=""
                  onChange={(value) => handleProjectChange("github", value)}
                  isEditable={isEditable}
                  placeholder="Add GitHub link (optional)"
                  className="text-accent underline hover:text-accent/80"
                  isLink={true}
                />
              )}
              {project.liveDemo && (
                <EditableText
                  value={project.liveDemo}
                  onChange={(value) => handleProjectChange("liveDemo", value)}
                  isEditable={isEditable}
                  placeholder="Live demo link (optional)"
                  className="text-accent underline hover:text-accent/80"
                  isLink={true}
                />
              )}
              {!project.liveDemo && isEditable && (
                <EditableText
                  value=""
                  onChange={(value) => handleProjectChange("liveDemo", value)}
                  isEditable={isEditable}
                  placeholder="Add live demo link (optional)"
                  className="text-accent underline hover:text-accent/80"
                  isLink={true}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Image */}
      <section className="section-container bg-[hsl(var(--section-bg))]">
        <div className="max-w-6xl mx-auto">
          <EditableImage
            src={project.image}
            alt={project.title}
            onChange={(value) => handleProjectChange("image", value)}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            isEditable={isEditable}
          />
        </div>
      </section>

      {/* Category Images */}
      {isEditable && (
        <section className="section-container">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Category Images</h2>
              <Button onClick={handleAddCategoryImage} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images?.map((image, index) => (
                <div key={index} className="card-elevated overflow-hidden relative group">
                  <EditableImage
                    src={image}
                    alt={`${project.title} - Category Image ${index + 1}`}
                    onChange={(value) => {
                      const newImages = [...(project.images || [])];
                      newImages[index] = value;
                      handleProjectChange("images", newImages);
                    }}
                    className="w-full h-48 object-cover"
                    isEditable={isEditable}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveCategoryImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Detailed Description */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About This Project</h2>
          <div className="prose prose-lg max-w-none">
            <EditableText
              value={project.detailedDescription}
              onChange={(value) => handleProjectChange("detailedDescription", value)}
              multiline
              isEditable={isEditable}
              className="text-muted-foreground leading-relaxed"
            />
          </div>
        </div>
      </section>

      {/* Additional Images */}
      {project.images && project.images.length > 0 && !isEditable && (
        <section className="section-container bg-[hsl(var(--section-bg))]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.map((image, index) => (
                <div key={index} className="card-elevated overflow-hidden">
                  <img
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technologies Used */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Technologies Used</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {project.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-lg px-4 py-2">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
