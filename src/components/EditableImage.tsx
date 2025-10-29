import { useState } from "react";
import { Link, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (src: string) => void;
  className?: string;
  isEditable?: boolean;
}

export const EditableImage = ({
  src,
  alt,
  onChange,
  className = "",
  isEditable = false,
}: EditableImageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState(src);

  const handleUrlSubmit = () => {
    onChange(urlInput);
    setIsDialogOpen(false);
  };

  return (
    <div
      className={`relative ${isEditable ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={src} alt={alt} className={className} />
      {isEditable && isHovered && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg transition-all">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="text-black">
                <Link className="h-4 w-4 mr-2" />
                Change Image URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter Image URL</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <div className="flex gap-2">
                  <Button onClick={handleUrlSubmit} className="flex-1">
                    Update Image
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {isEditable && !isHovered && (
        <div className="absolute top-2 right-2 bg-black/70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};
