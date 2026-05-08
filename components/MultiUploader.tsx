"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, X, Plus, Clipboard } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPT = "image/png,image/jpeg,image/jpg,image/webp";
const MAX = 3;

async function resizeImage(file: File, maxDim = 768): Promise<File> {
  try {
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
  } catch {
    return file;
  }
}

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
};

export function MultiUploader({ files, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  // Object URLs need to be revoked
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  const addFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles);
      const room = MAX - files.length;
      if (room <= 0) return;
      const resized = await Promise.all(arr.slice(0, room).map((f) => resizeImage(f)));
      onChange([...files, ...resized]);
    },
    [files, onChange]
  );

  const remove = (idx: number) => onChange(files.filter((_, i) => i !== idx));

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const imgs = Array.from(e.clipboardData.items)
        .filter((i) => i.type.startsWith("image/"))
        .map((i) => i.getAsFile())
        .filter((f): f is File => !!f);
      if (imgs.length) addFiles(imgs);
    },
    [addFiles]
  );

  const empty = files.length === 0;

  return (
    <div onPaste={onPaste}>
      {empty ? (
        // Editorial empty state with dashed gradient border
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "relative w-full overflow-hidden rounded-3xl border-2 border-dashed transition group",
            drag
              ? "border-pink bg-pink/5 scale-[1.005]"
              : "border-border hover:border-pink/40 bg-surface"
          )}
        >
          <div className="hero-glow opacity-30" />
          <div className="relative z-10 px-6 py-12 sm:py-16 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-gradient shadow-cta flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <ImagePlus size={22} className="text-white" />
            </div>
            <h3 className="text-display text-2xl sm:text-3xl mb-1">Drop the chat.</h3>
            <p className="text-sm text-text2 max-w-xs leading-relaxed">
              Up to {MAX} screenshots. Click, drag, or paste from clipboard.
            </p>
            <div className="mt-4 flex items-center gap-3 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1">
                <Clipboard size={11} />
                <kbd className="font-mono bg-surface2 border border-border rounded px-1 py-0.5">
                  ⌘V
                </kbd>
              </span>
              <span>·</span>
              <span>PNG · JPG · WEBP · ≤ 5 MB each</span>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </button>
      ) : (
        // Filmstrip
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "rounded-2xl border bg-surface p-3 transition",
            drag ? "border-pink" : "border-border"
          )}
        >
          <div className="flex items-center gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative shrink-0 w-28 h-36 rounded-xl overflow-hidden bg-black snap-start group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`screenshot ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-black/70 text-white rounded-full w-5 h-5 inline-flex items-center justify-center">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-bold text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  aria-label={`Remove screenshot ${i + 1}`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {files.length < MAX && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="shrink-0 w-28 h-36 rounded-xl border-2 border-dashed border-border hover:border-pink/40 flex flex-col items-center justify-center text-muted hover:text-text transition snap-start"
                aria-label="Add screenshot"
              >
                <Plus size={22} />
                <span className="text-[11px] mt-1">Add</span>
              </button>
            )}
          </div>
          {files.length > 1 && (
            <p className="text-[11px] text-muted mt-2 px-1">
              Order matters — leftmost is the oldest part of the convo.
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}
    </div>
  );
}
