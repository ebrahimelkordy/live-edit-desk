import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { loadPortfolioData, savePortfolioData, defaultPortfolioData } from "@/lib/storage";
import type { BlogPost } from "@/types/portfolio";
import Masonry from "react-masonry-css";
import { SkeletonCard } from "@/components/SkeletonCard";

interface BlogProps {
  isEditable?: boolean;
}

export const Blog = ({ isEditable = false }: BlogProps) => {
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

  const handlePostChange = (id: string, field: keyof BlogPost, value: any) => {
    const updated = {
      ...data,
      blog: data.blog.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleAddPost = () => {
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: "New Blog Post",
      excerpt: "Blog post excerpt here...",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
      date: new Date().toISOString().split("T")[0],
      order: data.blog.length,
    };
    const updated = { ...data, blog: [...data.blog, newPost] };
    setData(updated);
    savePortfolioData(updated);
  };

  const handleDeletePost = (id: string) => {
    const updated = {
      ...data,
      blog: data.blog.filter((p) => p.id !== id),
    };
    setData(updated);
    savePortfolioData(updated);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(data.blog);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    const reorderedWithOrder = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    const updated = { ...data, blog: reorderedWithOrder };
    setData(updated);
    savePortfolioData(updated);
  };

  const sortedPosts = [...data.blog].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen">
      <section className="section-container pt-32 pb-20">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Blog Posts</h2>

        {isEditable ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="blog">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                >
                  {sortedPosts.map((post, index) => (
                    <Draggable key={post.id} draggableId={post.id} index={index}>
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
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                            {post.image && (
                              <EditableImage
                                src={post.image}
                                alt={post.title}
                                onChange={(value) => handlePostChange(post.id, "image", value)}
                                className="w-full h-64 object-cover"
                                isEditable={isEditable}
                              />
                            )}
                          </div>
                          <div className="p-6" {...provided.dragHandleProps}>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/60 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Selene Yu</p>
                                <p className="text-xs text-muted-foreground">
                                  <EditableText
                                    value={post.date}
                                    onChange={(value) => handlePostChange(post.id, "date", value)}
                                    isEditable={isEditable}
                                  />
                                </p>
                              </div>
                            </div>

                            <h3 className="text-2xl font-semibold mb-3">
                              <EditableText
                                value={post.title}
                                onChange={(value) => handlePostChange(post.id, "title", value)}
                                isEditable={isEditable}
                              />
                            </h3>

                            <p className="text-muted-foreground">
                              <EditableText
                                value={post.excerpt}
                                onChange={(value) => handlePostChange(post.id, "excerpt", value)}
                                multiline
                                isEditable={isEditable}
                              />
                            </p>
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
            {sortedPosts.map((post) => (
              <div key={post.id} className="card-elevated bg-card overflow-hidden mb-8">
                {post.image && (
                  <img src={post.image} alt={post.title} className="w-full object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/60 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Selene Yu</p>
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{post.title}</h3>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </Masonry>
        )}

        {isEditable && (
          <div className="mt-8 text-center">
            <Button onClick={handleAddPost} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Blog Post
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
