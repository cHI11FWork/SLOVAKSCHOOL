"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { url } = await uploadImage(formData);
      onChange(url);
      toast.success("Фото завантажено");
    } catch {
      toast.error("Не вдалося завантажити фото");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border-gray bg-pink-light/40">
        {value ? (
          <>
            <Image src={value} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-navy shadow"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <p className="px-4 text-center text-sm text-navy/50">Немає зображення</p>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin text-pink" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        <Upload className="mr-1.5 h-3.5 w-3.5" />
        Завантажити фото
      </Button>
    </div>
  );
}
