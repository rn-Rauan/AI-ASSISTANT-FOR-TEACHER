import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Trash2 } from "lucide-react";
import type { Disciplina } from "@/domain/entities/Disciplina";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface SubjectCardProps {
  subject: Disciplina;
  index?: number;
  onDelete?: () => void;
}

export function SubjectCard({ subject, index = 0, onDelete }: SubjectCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const displayName = subject.nome || subject.disciplina_codigo;
  const displayGrade = subject.anoSerieNome || subject.ano_serie;

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

  return (
    <>
      <Link
        to={`/disciplinas/${subject.id}`}
        className={`block animate-slide-up opacity-0 stagger-${Math.min(index + 1, 4)}`}
        style={{ animationFillMode: "forwards" }}
      >
        <div className="group relative bg-card rounded-lg border border-border p-6 card-hover overflow-hidden">
          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
              <BookOpen className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                {displayName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm">{displayGrade}</span>
              </div>
            </div>

            {/* Actions Column */}
            <div className="flex flex-col items-center gap-6">
              {/* Arrow indicator */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Delete Button */}
              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors z-10 opacity-0 group-hover:opacity-100"
                  title="Excluir disciplina"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Disciplina"
        description={`Tem certeza que deseja excluir a disciplina "${displayName}"? Esta ação não pode ser desfeita e todo o conteúdo associado será perdido.`}
        variant="destructive"
        confirmText="Excluir"
      />
    </>
  );
}
