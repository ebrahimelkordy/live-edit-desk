import { useState, useRef } from "react";
import { Upload, Pencil } from "lucide-react";

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

  const handleClick = () => {
    if (isEditable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`relative ${isEditable ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img src={src} alt={alt} className={className} />
      {isEditable && isHovered && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg transition-all">
          <div className="text-white text-center">
            <Upload className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Click to upload</p>
          </div>
        </div>
      )}
      {isEditable && !isHovered && (
        <div className="absolute top-2 right-2 bg-black/70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil className="h-4 w-4 text-white" />
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
