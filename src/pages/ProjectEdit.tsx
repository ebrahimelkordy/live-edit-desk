import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Project } from "@/types/portfolio";
import { loadPortfolioData, savePortfolioData } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { EditableImageUpload } from "@/components/EditableImageUpload";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const ProjectEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [portfolioData, setPortfolioData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await loadPortfolioData();
                setPortfolioData(data);
                const foundProject = data.projects.find((p: Project) => p.id === id);
                if (foundProject) {
                    setProject(foundProject);
                } else {
                    // Create new project if not found
                    const newProject: Project = {
                        id: id || Date.now().toString(),
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
                        order: data.projects.length,
                    };
                    setProject(newProject);
                }
            } catch (error) {
                console.error("Failed to load project:", error);
                toast.error("Failed to load project");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleSave = async () => {
        if (!project || !portfolioData) return;

        try {
            const updatedProjects = portfolioData.projects.map((p: Project) =>
                p.id === project.id ? project : p
            );

            if (!portfolioData.projects.find((p: Project) => p.id === project.id)) {
                updatedProjects.push(project);
            }

            const updatedData = {
                ...portfolioData,
                projects: updatedProjects,
            };

            await savePortfolioData(updatedData);
            toast.success("Project saved successfully!");
            navigate("/dashboard/work");
        } catch (error) {
            console.error("Failed to save project:", error);
            toast.error("Failed to save project");
        }
    };

    const handleFieldChange = (field: keyof Project, value: any) => {
        if (!project) return;

        let normalizedValue = value;
        if ((field === "link" || field === "github" || field === "liveDemo") && value) {
            normalizedValue = value.trim();
            if (!normalizedValue.startsWith("http://") && !normalizedValue.startsWith("https://")) {
                normalizedValue = `https://${normalizedValue}`;
            }
        }

        setProject({ ...project, [field]: normalizedValue });
    };

    const handleAddImage = () => {
        if (!project) return;
        const newImages = [...(project.images || []), "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"];
        setProject({ ...project, images: newImages });
    };

    const handleRemoveImage = (index: number) => {
        if (!project || !project.images) return;
        const newImages = project.images.filter((_, i) => i !== index);
        setProject({ ...project, images: newImages });
    };

    const handleAddTag = () => {
        if (!project) return;
        const newTags = [...project.tags, "New Tag"];
        setProject({ ...project, tags: newTags });
    };

    const handleRemoveTag = (index: number) => {
        if (!project) return;
        const newTags = project.tags.filter((_, i) => i !== index);
        setProject({ ...project, tags: newTags });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                    <Button onClick={() => navigate('/dashboard/work')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/dashboard/work')}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Projects
                            </Button>
                            <h1 className="text-2xl font-bold">Edit Project</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/work/${project.id}`)}
                            >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Project
                            </Button>
                            <Button onClick={handleSave} className="gap-2">
                                <Save className="h-4 w-4" />
                                Save Project
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Basic Information */}
                    <div className="card-elevated p-6">
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Project Title</label>
                                <EditableText
                                    value={project.title}
                                    onChange={(value) => handleFieldChange("title", value)}
                                    isEditable={true}
                                    className="text-2xl font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Short Description</label>
                                <EditableText
                                    value={project.description}
                                    onChange={(value) => handleFieldChange("description", value)}
                                    isEditable={true}
                                    multiline
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Detailed Description</label>
                                <EditableText
                                    value={project.detailedDescription || ""}
                                    onChange={(value) => handleFieldChange("detailedDescription", value)}
                                    isEditable={true}
                                    multiline
                                    placeholder="Detailed description of the project..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Date</label>
                                <EditableText
                                    value={project.date}
                                    onChange={(value) => handleFieldChange("date", value)}
                                    isEditable={true}
                                    placeholder="YYYY-MM-DD"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Image */}
                    <div className="card-elevated p-6">
                        <h2 className="text-xl font-semibold mb-4">Main Image</h2>
                        <EditableImage
                            src={project.image}
                            alt={project.title}
                            onChange={(value) => handleFieldChange("image", value)}
                            className="w-full h-64 object-cover rounded-lg"
                            isEditable={true}
                        />
                    </div>

                    {/* Additional Images */}
                    <div className="card-elevated p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Additional Images</h2>
                            <Button onClick={handleAddImage} variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Image
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(project.images || []).map((image, index) => (
                                <div key={index} className="relative group">
                                    <EditableImage
                                        src={image}
                                        alt={`${project.title} - Image ${index + 1}`}
                                        onChange={(value) => {
                                            const newImages = [...(project.images || [])];
                                            newImages[index] = value;
                                            handleFieldChange("images", newImages);
                                        }}
                                        className="w-full h-32 object-cover rounded-lg"
                                        isEditable={true}
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="card-elevated p-6">
                        <h2 className="text-xl font-semibold mb-4">Links</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Project Link</label>
                                <EditableText
                                    value={project.link || ""}
                                    onChange={(value) => handleFieldChange("link", value)}
                                    isEditable={true}
                                    placeholder="https://your-project.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">GitHub Repository</label>
                                <EditableText
                                    value={project.github || ""}
                                    onChange={(value) => handleFieldChange("github", value)}
                                    isEditable={true}
                                    placeholder="https://github.com/username/repo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Live Demo</label>
                                <EditableText
                                    value={project.liveDemo || ""}
                                    onChange={(value) => handleFieldChange("liveDemo", value)}
                                    isEditable={true}
                                    placeholder="https://demo.your-project.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Technologies/Tags */}
                    <div className="card-elevated p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Technologies & Tags</h2>
                            <Button onClick={handleAddTag} variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Tag
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, index) => (
                                <div key={index} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1">
                                    <EditableText
                                        value={tag}
                                        onChange={(value) => {
                                            const newTags = [...project.tags];
                                            newTags[index] = value;
                                            handleFieldChange("tags", newTags);
                                        }}
                                        isEditable={true}
                                        className="text-sm"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveTag(index)}
                                        className="h-4 w-4 p-0 text-destructive hover:text-destructive/80"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
