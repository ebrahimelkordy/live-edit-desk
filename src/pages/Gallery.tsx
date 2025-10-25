import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { loadPortfolioData, savePortfolioData } from "@/lib/storage";
import type { GalleryItem } from "@/types/portfolio";

interface GalleryProps {
  isEditable?: boolean;
}

export const Gallery = ({ isEditable = false }: GalleryProps) => {
  const [data, setData] = useState(loadPortfolioData());

  const handleItemChange = (id: string, field: keyof GalleryItem, value: any) => {
    const updated = {
      ...data,
      gallery: data.gallery.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    };
    setData(updated);
    if (isEditable) savePortfolioData(updated);
  };

  const handleAddItem = () => {
    const newItem: GalleryItem = {
      id: `gallery-${Date.now()}`,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      caption: "New image",
      order: data.gallery.length,
    };
    const updated = { ...data, gallery: [...data.gallery, newItem] };
    setData(updated);
    savePortfolioData(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = {
      ...data,
      gallery: data.gallery.filter((item) => item.id !== id),
    };
    setData(updated);
    savePortfolioData(updated);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(data.gallery);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    const reorderedWithOrder = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    const updated = { ...data, gallery: reorderedWithOrder };
    setData(updated);
    savePortfolioData(updated);
  };

  const sortedItems = [...data.gallery].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen">
      <section className="section-container pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-lg text-muted-foreground mb-12">
            A curated collection of visual work and inspiration.
          </p>

          {isEditable && (
            <Button onClick={handleAddItem} className="mb-8">
              <Plus className="mr-2 h-4 w-4" /> Add Image
            </Button>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="gallery" isDropDisabled={!isEditable}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {sortedItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={!isEditable}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="group relative"
                        >
                          {isEditable && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}

                          <div className="rounded-2xl overflow-hidden card-elevated mb-4">
                            <EditableImage
                              src={item.image}
                              alt={item.caption}
                              onChange={(value) =>
                                handleItemChange(item.id, "image", value)
                              }
                              className="w-full h-64 object-cover"
                              isEditable={isEditable}
                            />
                          </div>

                          <p className="text-sm text-muted-foreground">
                            <EditableText
                              value={item.caption}
                              onChange={(value) =>
                                handleItemChange(item.id, "caption", value)
                              }
                              isEditable={isEditable}
                            />
                          </p>
                        </div>
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
