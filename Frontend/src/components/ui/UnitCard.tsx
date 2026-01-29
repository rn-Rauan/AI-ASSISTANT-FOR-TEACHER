import { Link } from "react-router-dom";
import { Calendar, FileText, ChevronRight } from "lucide-react";
import type { Unidade } from "@/domain/entities/Unidade";

interface UnitCardProps {
  unit: Unidade;
  index?: number;
}

export function UnitCard({ unit, index = 0 }: UnitCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const contentsCount = unit.conteudos?.length || 0;

  return (
    <Link
      to={`/unidades/${unit.id}`}
      className={`block animate-slide-up opacity-0 stagger-${Math.min(index + 1, 4)}`}
      style={{ animationFillMode: "forwards" }}
    >
      <div className="group relative bg-card rounded-lg border border-border p-5 card-hover">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Theme */}
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {unit.tema}
            </h3>

            {/* Meta info */}
            <div className="flex items-center gap-4 mt-2.5">
              {unit.criadoEm && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs">{formatDate(unit.criadoEm)}</span>
                </div>
              )}
              {contentsCount > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-xs">
                    {contentsCount} {contentsCount === 1 ? "conteúdo" : "conteúdos"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary transition-colors duration-200">
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
