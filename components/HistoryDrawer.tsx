"use client";

import { Trash2, Clock } from "lucide-react";
import { Drawer } from "./Drawer";
import { ReplyCard } from "./ReplyCard";
import { AnalysisPanel } from "./AnalysisPanel";
import type { HistoryItem } from "@/lib/storage";
import { LANGUAGE_LABELS } from "@/lib/schema";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function HistoryDrawer({ open, onClose, items, onRemove, onClear }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Drawer open={open} onClose={onClose} title={`History (${items.length})`} side="left">
      {items.length === 0 ? (
        <div className="text-center text-muted text-sm py-12">
          <Clock size={28} className="mx-auto mb-3 opacity-50" />
          Your past generations will show up here.
          <br />
          Stored only on this device.
        </div>
      ) : (
        <>
          <button
            onClick={() => {
              if (confirm("Clear all history? This can't be undone.")) onClear();
            }}
            className="text-xs text-muted hover:text-bold transition flex items-center gap-1 mb-4"
          >
            <Trash2 size={12} /> Clear all
          </button>
          <div className="space-y-3">
            {items.map((it) => {
              const isOpen = expanded === it.id;
              return (
                <div
                  key={it.id}
                  className="bg-panel border border-border rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : it.id)}
                    className="w-full p-3 text-left flex items-center gap-3 hover:bg-panel2 transition"
                  >
                    <div className="flex -space-x-3">
                      {it.thumbnails.slice(0, 3).map((src, i) =>
                        src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={i}
                            src={src}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border-2 border-bg"
                          />
                        ) : null
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted">{timeAgo(it.ts)}</div>
                      <div className="text-sm truncate">
                        {it.moods.join(" + ")} · {LANGUAGE_LABELS[it.language]} · {it.intensity}/10
                      </div>
                      {it.context && (
                        <div className="text-xs text-muted truncate italic">“{it.context}”</div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(it.id);
                      }}
                      className="text-muted hover:text-bold transition p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </button>

                  {isOpen && (
                    <div className="border-t border-border p-3 space-y-3">
                      {it.analysis && <AnalysisPanel analysis={it.analysis} />}
                      {it.replies.map((r, i) => (
                        <ReplyCard key={i} reply={r} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </Drawer>
  );
}
