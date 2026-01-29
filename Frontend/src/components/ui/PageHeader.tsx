import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backTo,
  backLabel = "Voltar",
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8 animate-fade-in">
      {backTo && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-6 gap-2 pl-2 pr-4 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all group"
          asChild
        >
          <Link to={backTo}>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {backLabel}
          </Link>
        </Button>
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
