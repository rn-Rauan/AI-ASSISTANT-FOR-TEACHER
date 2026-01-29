import { useState } from "react";
import { FileText, Presentation, ClipboardList, ChevronDown, ChevronUp, Sparkles, Download, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
import type { Conteudo, TipoConteudo } from "@/domain/entities/Conteudo";
import { Button } from "./Button";
import { slideService } from "@/infrastructure/services/slide.service";

interface ContentCardProps {
  content: Conteudo;
  index?: number;
  onRefine?: (content: Conteudo) => void;
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

export function ContentCard({ content, index = 0, onRefine }: ContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const config = typeConfig[content.tipo];
  const Icon = config.icon;

  const previewText = content.conteudo.slice(0, 200);
  const hasMore = content.conteudo.length > 200;

  const handleDownload = async () => {
    setIsDownloading(true);

    if (content.tipo === 'slide') {
      try {
        await slideService.downloadPPTXDireto(content.id, `slide-${content.id.slice(0, 6)}.pptx`);
      } catch (error) {
        console.error("Erro ao baixar PPTX:", error);
      }
      setIsDownloading(false);
      return;
    }

    const element = document.getElementById(`pdf-content-${content.id}`);
    
    if (element) {
      const pdfOptions = {
        margin: 15,
        filename: `${config.label}-${content.id.slice(0, 6)}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      try {
        await html2pdf().set(pdfOptions).from(element).save();
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
      }
    }
    setIsDownloading(false);
  };

  return (
    <div
      className={`animate-slide-up opacity-0 stagger-${Math.min(index + 1, 4)}`}
      style={{ animationFillMode: "forwards" }}
    >
      {/* Hidden element for PDF generation */}
      <div className="hidden">
        <div id={`pdf-content-${content.id}`} className="p-8 bg-white text-black">
           <div className="mb-6 border-b pb-4">
             <div className="flex items-center gap-2 mb-2">
               <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-md border border-gray-200">
                 {config.label}
               </span>
               <span className="text-xs text-gray-500">
                 {content.criadoEm && new Date(content.criadoEm).toLocaleDateString("pt-BR")}
               </span>
             </div>
             <h1 className="text-2xl font-bold text-gray-900">PedagogIA - Conteúdo Gerado</h1>
           </div>
           <article className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-ul:text-gray-800 prose-li:text-gray-800">
             <ReactMarkdown>{content.conteudo}</ReactMarkdown>
           </article>
           <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
             Gerado automaticamente por PedagogIA
           </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-5 card-hover relative group">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.variant}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </div>

          <div className="flex items-center gap-3">
            {content.criadoEm && (
                <span className="text-xs text-muted-foreground border-r border-border pr-3">
                {new Date(content.criadoEm).toLocaleDateString("pt-BR")}
                </span>
            )}
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs gap-1.5 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary transition-all shadow-sm"
              onClick={handleDownload}
              disabled={isDownloading}
              title={content.tipo === 'slide' ? "Baixar Slide PPTX" : "Baixar PDF"}
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {content.tipo === 'slide' ? 'PPTX' : 'PDF'}
            </Button>

            {onRefine && (
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 text-xs gap-1.5 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary transition-all shadow-sm"
                    onClick={() => onRefine(content)}
                    title="Refinar com IA"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    Refinar
                </Button>
            )}
          </div>
        </div>

        {/* Content preview */}
        <div className="text-sm text-foreground leading-relaxed">
          {isExpanded ? (
            <article className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground prose-li:marker:text-primary">
              <ReactMarkdown>{content.conteudo}</ReactMarkdown>
            </article>
          ) : (
            <div className="whitespace-pre-wrap font-medium text-muted-foreground/80">
              {previewText}
              {hasMore && "..."}
            </div>
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
