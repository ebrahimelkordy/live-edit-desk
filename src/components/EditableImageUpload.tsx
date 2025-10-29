import { useState } from "react";
import { Link, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface EditableImageUploadProps {
  value?: string;
  onChange: (src: string) => void;
  label: string;
  isEditable?: boolean;
  className?: string;
}

export const EditableImageUpload = ({
  value,
  onChange,
  label,
  isEditable = false,
  className = "",
}: EditableImageUploadProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");

  const handleUrlSubmit = () => {
    onChange(urlInput);
    setIsDialogOpen(false);
  };

  if (!isEditable) {
    return value ? (
      <img src={value} alt={label} className={className} />
    ) : null;
  }

  return (
    <div className={`relative group ${className}`}>
      {value ? (
        <>
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary">
                  <Link className="h-4 w-4 mr-2" />
                  Change URL
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
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors bg-muted/20">
              <Link className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
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
                  Add Image
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
