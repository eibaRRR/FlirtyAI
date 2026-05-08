"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  file: File | null;
  onChange: (file: File | null) => void;
};

const ACCEPT = "image/png,image/jpeg,image/jpg,image/webp";

async function resizeImage(file: File, maxDim = 1024): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  if (scale === 1) return file;

  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);

  const blob: Blob | null = await new Promise((res) =>
    canvas.toBlob((b) => res(b), "image/jpeg", 0.9)
  );
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
}

export function ConversationUploader({ file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const handleFile = useCallback(
    async (f: File | null) => {
      if (!f) {
        onChange(null);
        setPreview(null);
        return;
      }
      const resized = await resizeImage(f);
      onChange(resized);
      setPreview(URL.createObjectURL(resized));
    },
    [onChange]
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
      if (item) {
        const f = item.getAsFile();
        if (f) handleFile(f);
      }
    },
    [handleFile]
  );

  return (
    <div
      onPaste={onPaste}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
      }}
      className={cn(
        "relative rounded-2xl border-2 border-dashed transition cursor-pointer overflow-hidden",
        drag ? "border-pink bg-pink/5" : "border-border bg-panel hover:border-purple/60",
        preview ? "p-0" : "p-8"
      )}
      onClick={() => !preview && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="conversation" className="w-full max-h-[420px] object-contain bg-black" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFile(null);
            }}
            className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white rounded-full p-2"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center">
            <ImagePlus size={22} />
          </div>
          <div>
            <div className="font-medium">Drop your chat screenshot here</div>
            <div className="text-sm text-muted mt-1">
              or click to upload · paste with Ctrl+V · PNG / JPG / WEBP · max 5 MB
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
