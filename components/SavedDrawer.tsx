"use client";

import { Bookmark, Copy, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { Drawer } from "./Drawer";
import { useToast, useCopyWithToast } from "./Toaster";
import { useSaved, type SavedReply } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

const RISK_CLS: Record<string, string> = {
  safe: "bg-safe/15 text-safe border-safe/30",
  medium: "bg-med/15 text-med border-med/30",
  bold: "bg-bold/15 text-bold border-bold/30",
};

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function SavedItem({ item, onRemove }: { item: SavedReply; onRemove: () => void }) {
  const copyWithToast = useCopyWithToast();
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await copyWithToast(item.text, "Copied");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="bg-panel border border-border rounded-2xl p-3">
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap text-[10px] uppercase tracking-wider">
          {item.risk && (
            <span
              className={cn(
                "font-semibold px-2 py-0.5 rounded-full border",
                RISK_CLS[item.risk]
              )}
            >
              {item.risk}
            </span>
          )}
          {item.moods && item.moods.length > 0 && (
            <span className="bg-panel2 border border-border text-muted rounded-full px-2 py-0.5">
              {item.moods.join(" + ")}
            </span>
          )}
          <span className="text-muted normal-case tracking-normal">{timeAgo(item.ts)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onCopy}
            className="text-muted hover:text-pink transition flex items-center gap-1"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
          <button
            onClick={onRemove}
            className="text-muted hover:text-bold transition"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div className="space-y-1">
        {item.messages.map((m, i) => (
          <div
            key={i}
            className="text-sm whitespace-pre-wrap leading-relaxed bg-panel2 border border-border rounded-lg px-3 py-2"
            dir="auto"
          >
            {m}
          </div>
        ))}
      </div>
      {item.reasoning && (
        <div className="mt-2 text-xs text-muted italic">{item.reasoning}</div>
      )}
    </div>
  );
}

export function SavedDrawer({ open, onClose }: Props) {
  const saved = useSaved();
  const { toast } = useToast();

  return (
    <Drawer open={open} onClose={onClose} title={`Saved (${saved.items.length})`} side="left">
      {saved.items.length === 0 ? (
        <div className="text-center text-muted text-sm py-12">
          <Bookmark size={28} className="mx-auto mb-3 opacity-50" />
          Replies you save will live here.
          <br />
          Tap the bookmark icon on any reply to save it.
        </div>
      ) : (
        <>
          <button
            onClick={() => {
              if (confirm("Clear all saved replies?")) {
                saved.clear();
                toast("Cleared saved replies", "info");
              }
            }}
            className="text-xs text-muted hover:text-bold transition flex items-center gap-1 mb-4"
          >
            <Trash2 size={12} /> Clear all
          </button>
          <div className="space-y-3">
            {saved.items.map((it) => (
              <SavedItem
                key={it.id}
                item={it}
                onRemove={() => {
                  saved.remove(it.id);
                  toast("Removed", "info");
                }}
              />
            ))}
          </div>
        </>
      )}
    </Drawer>
  );
}
