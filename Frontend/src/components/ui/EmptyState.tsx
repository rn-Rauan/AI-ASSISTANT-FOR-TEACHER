import { FolderOpen, BookOpen, FileText } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: "folder" | "book" | "file";
  action?: React.ReactNode;
}

const icons = {
  folder: FolderOpen,
  book: BookOpen,
  file: FileText,
};

export function EmptyState({
  title,
  description,
  icon = "folder",
  action,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
