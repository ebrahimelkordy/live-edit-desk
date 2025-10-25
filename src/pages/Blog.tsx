import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { loadPortfolioData, savePortfolioData } from "@/lib/storage";
import type { BlogPost } from "@/types/portfolio";

interface BlogProps {
  isEditable?: boolean;
}

export const Blog = ({ isEditable = false }: BlogProps) => {
  const [data, setData] = useState(loadPortfolioData());

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Thoughts, ideas, and insights on design and development.
          </p>

          {isEditable && (
            <Button onClick={handleAddPost} className="mb-8">
              <Plus className="mr-2 h-4 w-4" /> Add Blog Post
            </Button>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="blog" isDropDisabled={!isEditable}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-12"
                >
                  {sortedPosts.map((post, index) => (
                    <Draggable
                      key={post.id}
                      draggableId={post.id}
                      index={index}
                      isDragDisabled={!isEditable}
                    >
                      {(provided) => (
                        <article
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          id={post.id}
                          className="group relative"
                        >
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
                            <div className="mb-6 rounded-2xl overflow-hidden card-elevated">
                              <EditableImage
                                src={post.image}
                                alt={post.title}
                                onChange={(value) =>
                                  handlePostChange(post.id, "image", value)
                                }
                                className="w-full h-auto"
                                isEditable={isEditable}
                              />
                            </div>
                          )}

                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Selene Yu</p>
                              <p className="text-xs text-muted-foreground">
                                <EditableText
                                  value={post.date}
                                  onChange={(value) =>
                                    handlePostChange(post.id, "date", value)
                                  }
                                  isEditable={isEditable}
                                />
                              </p>
                            </div>
                          </div>

                          <h2 className="text-2xl font-bold mb-4">
                            <EditableText
                              value={post.title}
                              onChange={(value) =>
                                handlePostChange(post.id, "title", value)
                              }
                              isEditable={isEditable}
                            />
                          </h2>

                          <p className="text-muted-foreground">
                            <EditableText
                              value={post.excerpt}
                              onChange={(value) =>
                                handlePostChange(post.id, "excerpt", value)
                              }
                              multiline
                              isEditable={isEditable}
                            />
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
        </div>
      </section>
    </div>
  );
};
