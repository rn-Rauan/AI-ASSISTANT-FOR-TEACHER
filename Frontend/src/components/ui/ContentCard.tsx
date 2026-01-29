import { useState } from "react";
import { FileText, Presentation, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import type { Conteudo, TipoConteudo } from "@/domain/entities/Conteudo";

interface ContentCardProps {
  content: Conteudo;
  index?: number;
}

const typeConfig: Record<TipoConteudo, { label: string; icon: typeof FileText; variant: string }> = {
  plano_de_aula: {
    label: "Plano de Aula",
    icon: FileText,
    variant: "bg-primary/10 text-primary border-primary/20",
  },
  atividade: {
    label: "Atividade",
    icon: ClipboardList,
    variant: "bg-accent/10 text-accent border-accent/20",
  },
  slide: {
    label: "Slide",
    icon: Presentation,
    variant: "bg-secondary/10 text-secondary border-secondary/20",
  },
};

export function ContentCard({ content, index = 0 }: ContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = typeConfig[content.tipo];
  const Icon = config.icon;

  const previewText = content.conteudo.slice(0, 200);
  const hasMore = content.conteudo.length > 200;

  return (
    <div
      className={`animate-slide-up opacity-0 stagger-${Math.min(index + 1, 4)}`}
      style={{ animationFillMode: "forwards" }}
    >
      <div className="bg-card rounded-lg border border-border p-5 card-hover">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.variant}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </div>

          {content.criadoEm && (
            <span className="text-xs text-muted-foreground">
              {new Date(content.criadoEm).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>

        {/* Content preview */}
        <div className="text-sm text-foreground leading-relaxed">
          {isExpanded ? (
            <p className="whitespace-pre-wrap">{content.conteudo}</p>
          ) : (
            <p>
              {previewText}
              {hasMore && "..."}
            </p>
          )}
        </div>

        {/* Expand/Collapse button */}
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Ver mais
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
