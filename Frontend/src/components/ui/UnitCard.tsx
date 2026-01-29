import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, FileText, ChevronRight, Trash2 } from "lucide-react";
import type { Unidade } from "@/domain/entities/Unidade";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface UnitCardProps {
  unit: Unidade;
  index?: number;
  onDelete?: () => void;
}

export function UnitCard({ unit, index = 0, onDelete }: UnitCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const contentsCount = unit.conteudos?.length || 0;

  return (
    <>
      <div
        className={`relative group animate-slide-up opacity-0 stagger-${Math.min(index + 1, 4)}`}
        style={{ animationFillMode: "forwards" }}
      >
        <Link
          to={`/unidades/${unit.id}`}
          className="block"
        >
          <div className="group relative bg-card rounded-lg border border-border p-5 card-hover pr-12">
            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors z-10 opacity-0 group-hover:opacity-100"
                title="Excluir unidade"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

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
              <div className="flex-shrink-0 opacity-100 group-hover:opacity-0 transition-opacity duration-200">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Unidade"
        description={`Tem certeza que deseja excluir a unidade "${unit.tema}"? Esta ação não pode ser desfeita.`}
        variant="destructive"
        confirmText="Excluir"
      />
    </>
  );
}
