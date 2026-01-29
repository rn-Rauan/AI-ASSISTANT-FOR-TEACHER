import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContentCard } from "@/components/ui/ContentCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Unidade } from "@/domain/entities/Unidade";
import type { Conteudo } from "@/domain/entities/Conteudo";
import { unidadeService } from "@/infrastructure/services/unidade.service";
import { conteudoService } from "@/infrastructure/services/conteudo.service";

export const PaginaUnidade = () => {
  const { id } = useParams<{ id: string }>();
  
  const [unidade, setUnidade] = useState<Unidade | null>(null);
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (unidadeId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [dadosUnidade, dadosConteudos] = await Promise.all([
        unidadeService.getById(unidadeId),
        conteudoService.listarPorUnidade(unidadeId)
      ]);
      setUnidade(dadosUnidade);
      setConteudos(dadosConteudos);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError("Não foi possível carregar os detalhes da unidade.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (id) {
      loadData(id);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
        {isLoading ? (
          <>
            <div className="mb-8 animate-pulse">
              <div className="h-4 w-24 bg-muted rounded mb-4" />
              <div className="h-8 w-80 bg-muted rounded mb-2" />
              <div className="h-4 w-48 bg-muted rounded" />
            </div>
            <LoadingState count={3} variant="card" />
          </>
        ) : error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : (
          <>
            <PageHeader
              title={unidade?.tema || "Detalhes da Unidade"}
              subtitle={
                unidade?.criadoEm
                  ? `Criado em ${formatDate(unidade.criadoEm)}`
                  : undefined
              }
              backTo={unidade?.disciplinaID ? `/disciplinas/${unidade.disciplinaID}` : "/"}
              backLabel="Voltar à Disciplina"
            />

            {/* Contents section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Conteúdos Gerados
              </h2>

              {conteudos.length === 0 ? (
                <EmptyState
                  title="Nenhum conteúdo gerado"
                  description="Esta unidade ainda não possui conteúdos. Use o assistente de IA para gerar planos de aula, atividades e slides."
                  icon="file"
                  // TODO: Add action to generate content if API supports it directly from here
                />
              ) : (
                <div className="space-y-4">
                  {conteudos.map((conteudo, index) => (
                    <ContentCard
                      key={conteudo.id}
                      content={conteudo}
                      index={index}
                    />
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
