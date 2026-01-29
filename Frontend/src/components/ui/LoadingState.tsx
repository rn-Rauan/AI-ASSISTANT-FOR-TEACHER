interface LoadingStateProps {
  count?: number;
  variant?: "card" | "list";
}

export function LoadingState({ count = 3, variant = "card" }: LoadingStateProps) {
  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-lg border border-border p-5 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
              <div className="w-8 h-8 bg-muted rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-lg border border-border p-6 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-muted rounded-lg" />
            <div className="flex-1">
              <div className="h-5 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
