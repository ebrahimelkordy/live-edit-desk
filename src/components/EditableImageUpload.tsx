import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Change
            </Button>
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
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors bg-muted/20"
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
