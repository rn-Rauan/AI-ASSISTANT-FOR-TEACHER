import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubjectCard } from "@/components/ui/SubjectCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Disciplina } from "@/domain/entities/Disciplina";
import { disciplinaService } from "@/infrastructure/services/disciplina.service";
import { ModalCriarDisciplina } from "@/presentation/components/ModalCriarDisciplina";

export const PaginaDashboard = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadDisciplinas();
  }, []);

  const loadDisciplinas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dados = await disciplinaService.getAll();
      setDisciplinas(dados);
    } catch (err) {
      console.error('Erro ao buscar disciplinas:', err);
      setError("Não foi possível carregar as disciplinas. Verifique se o backend está rodando.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    loadDisciplinas();
  };

  const handleCreateSuccess = () => {
    loadDisciplinas();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Estilo Cultura Digital */}
      <header className="bg-[#0f766e] border-b border-[#115e59] sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white leading-tight">
                PedagogIA
              </span>
              <span className="text-xs font-medium text-emerald-50 opacity-90">
                Plataforma de Ensino Inteligente
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section Centralizada */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Assistente Pedagógico Inteligente
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Painel do Professor
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            Gerencie suas disciplinas e crie planos de aula, atividades e avaliações alinhadas à BNCC com o poder da Inteligência Artificial.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="h-12 px-8 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all rounded-full font-semibold"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Nova Disciplina
            </Button>
          </div>
        </div>

        {/* Divisor Visual */}
        <div className="relative mb-10 animate-fade-in stagger-1">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border/60"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Suas Disciplinas
            </span>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-8">
            <LoadingState count={3} variant="card" />
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="max-w-md mx-auto mt-8">
            <ErrorState message={error} onRetry={handleRetry} />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && disciplinas.length === 0 && (
          <div className="mt-8 animate-fade-in stagger-2">
            <EmptyState
              title="Comece sua jornada"
              description="Você ainda não possui disciplinas. Crie sua primeira disciplina acima para começar a usar o assistente."
              icon="book"
            />
          </div>
        )}

        {/* Subjects grid */}
        {!isLoading && !error && disciplinas.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in stagger-2">
            {disciplinas.map((disciplina, index) => (
              <SubjectCard
                key={disciplina.id}
                subject={disciplina}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      <ModalCriarDisciplina 
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};
