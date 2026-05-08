"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

/** Skeleton placeholder for a ReplyCard while the model is generating. */
export function ReplyCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="bg-panel border border-border rounded-2xl p-4 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-16" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <Skeleton className="h-4 w-[88%]" />
        <Skeleton className="h-4 w-[72%]" />
      </div>
      <Skeleton className="h-3 w-[55%]" />
    </div>
  );
}
