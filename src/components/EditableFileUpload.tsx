import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, FileText, X } from "lucide-react";

interface EditableFileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  isEditable?: boolean;
}

export const EditableFileUpload = ({ value, onChange, isEditable = false }: EditableFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");

  const handlePick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.type !== 'application/pdf') {
      setError('الرجاء اختيار ملف PDF فقط');
      return;
    }

    try {
      setIsUploading(true);
      setFilename(file.name);

      const dataBase64 = await readFileAsBase64(file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, mimeType: file.type, dataBase64 }),
      });

      if (!res.ok) {
        const msg = await safeText(res);
        throw new Error(msg || 'فشل رفع الملف');
      }

      const json = await res.json();
      if (json?.url) {
        onChange(json.url);
      }
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء رفع الملف');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
    setFilename('');
    setError(null);
  };

  if (!isEditable) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input type="file" ref={fileInputRef} accept="application/pdf" onChange={handleFileChange} className="hidden" />
        <Button onClick={handlePick} disabled={isUploading} variant="outline" className="gap-2">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          {isUploading ? 'جاري الرفع...' : 'رفع ملف CV (PDF)'}
        </Button>
        {value && (
          <Button onClick={handleClear} variant="ghost" size="sm" className="gap-1 text-destructive">
            <X className="h-4 w-4" /> إزالة
          </Button>
        )}
      </div>
      {filename && <p className="text-sm text-muted-foreground">ملف مختار: {filename}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is like: data:application/pdf;base64,....  We need only base64 part
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function safeText(res: Response): Promise<string> {
  try {
    const t = await res.text();
    return t;
  } catch {
    return '';
  }
}