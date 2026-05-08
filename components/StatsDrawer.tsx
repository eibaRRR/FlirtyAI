"use client";

import { BarChart3, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { Drawer } from "./Drawer";
import { useToast } from "./Toaster";
import { aggregate, aggregateByKey, useStats, type Aggregate } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

function pct(a: Aggregate): string {
  if (a.total === 0) return "—";
  return `${Math.round(a.successRate * 100)}%`;
}

function rateClass(a: Aggregate): string {
  if (a.total === 0) return "text-muted";
  if (a.successRate >= 0.6) return "text-safe";
  if (a.successRate >= 0.4) return "text-med";
  return "text-bold";
}

function Bar({ a }: { a: Aggregate }) {
  if (a.total === 0)
    return <div className="h-1.5 bg-panel2 rounded-full overflow-hidden" />;
  const workedPct = a.successRate * 100;
  return (
    <div className="h-1.5 bg-panel2 rounded-full overflow-hidden flex">
      <div
        className="bg-safe h-full transition-all"
        style={{ width: `${workedPct}%` }}
      />
      <div
        className="bg-bold h-full transition-all"
        style={{ width: `${100 - workedPct}%` }}
      />
    </div>
  );
}

function StatRow({ label, agg }: { label: string; agg: Aggregate }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className={cn("text-sm font-mono font-semibold", rateClass(agg))}>
          {pct(agg)}
        </span>
      </div>
      <Bar a={agg} />
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted mt-1.5">
        <span className="flex items-center gap-1">
          <ThumbsUp size={10} className="text-safe" /> {agg.worked}
        </span>
        <span className="flex items-center gap-1">
          {agg.flopped} <ThumbsDown size={10} className="text-bold" />
        </span>
      </div>
    </div>
  );
}

export function StatsDrawer({ open, onClose }: Props) {
  const { stats, clear } = useStats();
  const { toast } = useToast();

  const overall = aggregate(stats.entries);
  const byMood = aggregateByKey(stats.entries, "moods").slice(0, 8);
  const byRisk = aggregateByKey(stats.entries, "risk");
  const byLanguage = aggregateByKey(stats.entries, "language").slice(0, 8);

  return (
    <Drawer open={open} onClose={onClose} title="Your reply stats" side="left">
      {stats.entries.length === 0 ? (
        <div className="text-center text-muted text-sm py-12">
          <BarChart3 size={28} className="mx-auto mb-3 opacity-50" />
          No data yet.
          <br />
          Mark replies as <b className="text-text">Worked</b> or{" "}
          <b className="text-text">Flopped</b> to see what lands best.
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={() => {
              if (confirm("Reset all stats?")) {
                clear();
                toast("Stats cleared", "info");
              }
            }}
            className="text-xs text-muted hover:text-bold transition flex items-center gap-1"
          >
            <Trash2 size={12} /> Reset stats
          </button>

          <section>
            <h3 className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">
              Overall
            </h3>
            <StatRow label={`${overall.total} replies tracked`} agg={overall} />
          </section>

          {byRisk.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">
                By risk level
              </h3>
              <div className="space-y-2">
                {byRisk.map(({ value, agg }) => (
                  <StatRow key={value} label={value} agg={agg} />
                ))}
              </div>
            </section>
          )}

          {byMood.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">
                By mood
              </h3>
              <div className="space-y-2">
                {byMood.map(({ value, agg }) => (
                  <StatRow key={value} label={value} agg={agg} />
                ))}
              </div>
            </section>
          )}

          {byLanguage.length > 1 && (
            <section>
              <h3 className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">
                By language
              </h3>
              <div className="space-y-2">
                {byLanguage.map(({ value, agg }) => (
                  <StatRow key={value} label={value} agg={agg} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Drawer>
  );
}
