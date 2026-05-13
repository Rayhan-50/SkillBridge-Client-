"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorMessage({
  message,
  onRetry,
  className,
  compact = false,
}: ErrorMessageProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-sm text-destructive px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20",
          className
        )}
      >
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span className="flex-1 truncate">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="shrink-0 text-xs underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-center",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-sm text-foreground">Something went wrong</p>
        <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                     bg-destructive/10 text-destructive border border-destructive/20
                     hover:bg-destructive/20 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
