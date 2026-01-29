import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Loader2, BookOpen, FileText, Presentation, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { PageHeader } from "@/components/ui/PageHeader";
import { Header } from "@/presentation/components/Header";
import { conteudoService } from "@/infrastructure/services/conteudo.service";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";

export const CriarUnidade = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const disciplinaId = location.state?.disciplinaId as string;

  const [tema, setTema] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["plano_de_aula"]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!disciplinaId) {
      // Opcional: Redirecionar se não houver ID, mas vamos deixar o ErrorState lidar com isso
    }
  }, [disciplinaId]);

  const handleSuggestThemes = async () => {
    if (!disciplinaId) return;
    setIsLoadingSuggestions(true);
    setError(null);
    try {
      const themes = await conteudoService.sugerirTemas(disciplinaId);
      setSuggestions(themes || []);
    } catch (err) {
      console.error('Erro ao sugerir temas:', err);
      setError("Não foi possível gerar sugestões no momento.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setTema(suggestion);
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tema.trim() || !disciplinaId || selectedTypes.length === 0) return;

    setIsSaving(true);
    setError(null);
    try {
      const response = await conteudoService.gerar({
        disciplina_id: disciplinaId,
        tema: tema,
        tipos: selectedTypes,
        observacoes: observacoes
      });
      // Navigate to the newly created unit page
      navigate(`/unidades/${response.unidade.id}`);
    } catch (err) {
      console.error('Erro ao gerar conteúdo:', err);
      // Mensagem mais amigável para o usuário
      setError("Ocorreu um problema ao gerar o conteúdo com a IA. Por favor, tente novamente em alguns instantes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!disciplinaId) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
             <ErrorState 
                title="Disciplina não identificada"
                message="Não foi possível identificar a disciplina para criar a unidade." 
                action={<Button onClick={() => navigate('/')}>Voltar ao Início</Button>}
            />
        </div>
    );
  }

  const contentTypes = [
    {
      id: "plano_de_aula",
      title: "Plano de Aula",
      description: "Roteiro completo e estruturado para guiar sua aula",
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "peer-checked:border-primary"
    },
    {
      id: "atividade",
      title: "Atividade",
      description: "Exercícios e avaliações para fixação do conteúdo",
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "peer-checked:border-primary"
    },
    {
      id: "slide",
      title: "Slides",
      description: "Apresentação visual com tópicos principais",
      icon: Presentation,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "peer-checked:border-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
        <PageHeader
          title="Criar Nova Unidade"
          subtitle="Defina o tema e gere conteúdos automaticamente com IA"
          backTo={`/disciplinas/${disciplinaId}`}
          backLabel="Voltar"
        />

        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in mt-8">
          {/* Theme input */}
          <div className="space-y-4">
            <Label htmlFor="tema" className="text-lg font-semibold">
              Tema da Unidade
            </Label>
            <Input
              id="tema"
              type="text"
              placeholder="Ex: Introdução aos Números Racionais"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="h-14 text-lg"
              autoFocus
            />
            
            {/* AI Suggestions section */}
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    Sugestões da IA
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSuggestThemes}
                  disabled={isLoadingSuggestions}
                  className="h-9 px-4 text-xs font-medium border-primary/30 text-primary hover:bg-primary/5 hover:border-primary transition-all shadow-sm"
                >
                  {isLoadingSuggestions ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      Gerando sugestões...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-2" />
                      Gerar sugestões de temas
                    </>
                  )}
                </Button>
              </div>

              {suggestions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className={cn(
                        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all hover:-translate-y-0.5",
                        tema === suggestion
                          ? "border-primary bg-primary text-primary-foreground shadow-md"
                          : "border-border bg-background hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : (
                !isLoadingSuggestions && (
                  <p className="text-xs text-muted-foreground">
                    Clique em "Sugerir novos temas" para receber ajuda.
                  </p>
                )
              )}
              {error && <p className="text-xs text-destructive mt-2">{error}</p>}
            </div>
          </div>

          {/* Tipo de Conteúdo */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Tipo de conteúdo</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contentTypes.map((type) => {
                const isSelected = selectedTypes.includes(type.id);
                return (
                  <div
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={cn(
                      "relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-md",
                      isSelected
                        ? `border-primary bg-primary/5 ring-1 ring-primary`
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg",
                      type.bg,
                      type.color
                    )}>
                      <type.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">{type.title}</h3>
                    <p className="text-sm text-muted-foreground leading-snug">
                      {type.description}
                    </p>
                    
                    {isSelected && (
                      <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center animate-in zoom-in">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {selectedTypes.length === 0 && (
              <div className="flex items-center gap-2 py-3 px-4 rounded-lg bg-blue-50/50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 animate-in fade-in slide-in-from-top-2 border border-blue-100 dark:border-blue-900/30">
                <Info className="w-4 h-4 shrink-0" />
                <p className="text-sm font-medium">Selecione quais materiais você deseja que a IA gere para esta aula.</p>
              </div>
            )}
          </div>

          {/* Especificações */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="observacoes" className="text-lg font-semibold">
                Especificações da Aula
              </Label>
              <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
            </div>
            
            <div className="relative">
              <Textarea
                id="observacoes"
                placeholder="Descreva como deseja sua aula:
• Duração aproximada (ex: 50 minutos)
• Nível de dificuldade (básico, intermediário, avançado)
• Observações pedagógicas"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="min-h-[150px] text-base resize-y p-4 leading-relaxed"
              />
              <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Quanto mais detalhes você fornecer, mais personalizado será o conteúdo gerado.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 pt-6 border-t border-border">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                <Info className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-8"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                size="lg"
                disabled={!tema.trim() || selectedTypes.length === 0 || isSaving}
                className="px-8 min-w-[180px] bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Gerando conteúdo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gerar conteúdo
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
