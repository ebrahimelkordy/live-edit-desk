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
      <section className="section-container bg-[hsl(var(--section-bg))] pt-32 pb-20">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Gallery</h2>

        {isEditable ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="gallery">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                >
                  {sortedItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
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

                          <div className="card-elevated overflow-hidden mb-4">
                            <EditableImage
                              src={item.image}
                              alt={item.caption}
                              onChange={(value) => handleItemChange(item.id, "image", value)}
                              className="w-full h-64 object-cover"
                              isEditable={isEditable}
                            />
                          </div>

                          <p className="text-sm text-muted-foreground text-center">
                            <EditableText
                              value={item.caption}
                              onChange={(value) => handleItemChange(item.id, "caption", value)}
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sortedItems.map((item) => (
              <div key={item.id}>
                <div className="card-elevated overflow-hidden mb-4">
                  <img src={item.image} alt={item.caption} className="w-full h-64 object-cover" />
                </div>
                <p className="text-sm text-muted-foreground text-center">{item.caption}</p>
              </div>
            ))}
          </div>
        )}

        {isEditable && (
          <div className="mt-8 text-center">
            <Button onClick={handleAddItem} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Image
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
