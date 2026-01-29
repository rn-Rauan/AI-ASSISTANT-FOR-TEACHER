import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { UnitCard } from "@/components/ui/UnitCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Disciplina } from "@/domain/entities/Disciplina";
import type { Unidade } from "@/domain/entities/Unidade";
import { disciplinaService } from "@/infrastructure/services/disciplina.service";
import { unidadeService } from "@/infrastructure/services/unidade.service";

export const PaginaDisciplina = () => {
  const { id } = useParams<{ id: string }>();

  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (disciplinaId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Busca dados da disciplina e suas unidades em paralelo
      const [dadosDisciplina, dadosUnidades] = await Promise.all([
        disciplinaService.getById(disciplinaId),
        unidadeService.listarPorDisciplina(disciplinaId)
      ]);
      
      setDisciplina(dadosDisciplina);
      setUnidades(dadosUnidades);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError("Não foi possível carregar os dados da disciplina. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (id) {
      loadData(id);
    }
  };

  const displayName = disciplina?.nome || disciplina?.disciplina_codigo || "";
  const displayGrade = disciplina?.anoSerieNome || disciplina?.ano_serie || "";

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <>
            {/* Loading header skeleton */}
            <div className="mb-8 animate-pulse">
              <div className="h-4 w-24 bg-muted rounded mb-4" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="h-8 w-64 bg-muted rounded mb-2" />
                  <div className="h-4 w-40 bg-muted rounded" />
                </div>
                <div className="h-10 w-32 bg-muted rounded" />
              </div>
            </div>
            <LoadingState count={4} variant="list" />
          </>
        ) : error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : (
          <>
            <PageHeader
              title={displayName}
              subtitle={displayGrade}
              backTo="/"
              backLabel="Voltar ao Dashboard"
              action={
                <Link to="/unidades/criar" state={{ disciplinaId: disciplina?.id }}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Unidade
                  </Button>
                </Link>
              }
            />

            {/* Units section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Unidades de Ensino
              </h2>

              {unidades.length === 0 ? (
                <EmptyState
                  title="Nenhuma unidade cadastrada"
                  description="Comece criando sua primeira unidade de ensino para esta disciplina."
                  icon="folder"
                  action={
                    <Link to="/unidades/criar" state={{ disciplinaId: disciplina?.id }}>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Unidade
                      </Button>
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {unidades.map((unidade, index) => (
                    <UnitCard key={unidade.id} unit={unidade} index={index} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};
