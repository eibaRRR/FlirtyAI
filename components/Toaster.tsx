"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastKind = "success" | "error" | "info";

export type Toast = {
  id: string;
  kind: ToastKind;
  message: string;
};

type Ctx = {
  toast: (message: string, kind?: ToastKind) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast(): Ctx {
  const v = useContext(ToastCtx);
  // Always-safe fallback so components don't crash if Toaster isn't mounted yet
  if (!v) return { toast: () => {} };
  return v;
}

const ICONS: Record<ToastKind, typeof Check> = {
  success: Check,
  error: AlertCircle,
  info: Info,
};

const KIND_CLS: Record<ToastKind, string> = {
  success: "border-safe/40 text-safe",
  error: "border-bold/40 text-bold",
  info: "border-purple/40 text-purple",
};

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<Ctx["toast"]>((message, kind = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => remove(id), 3000);
  }, [remove]);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed z-[100] bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
        {toasts.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto bg-panel border rounded-xl shadow-2xl shadow-black/40 px-4 py-2.5 flex items-center gap-2.5 text-sm w-full animate-toast-in",
                KIND_CLS[t.kind]
              )}
            >
              <Icon size={16} className="shrink-0" />
              <span className="flex-1 text-text">{t.message}</span>
              <button
                onClick={() => remove(t.id)}
                className="text-muted hover:text-text transition shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

// Convenience: copy text + show toast
export function useCopyWithToast() {
  const { toast } = useToast();
  return useCallback(
    async (text: string, label = "Copied") => {
      try {
        await navigator.clipboard.writeText(text);
        toast(label, "success");
      } catch {
        toast("Couldn't copy", "error");
      }
    },
    [toast]
  );
}

// Wrap once at module level so SSR is fine
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
