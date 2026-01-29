import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/PageHeader";
import { disciplinaService } from "@/infrastructure/services/disciplina.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISCIPLINA_NOMES, ANO_SERIE_MAP } from "@/constants/domain-options";

export const PaginaCriarDisciplina = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [anoSerie, setAnoSerie] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !anoSerie.trim()) return;

    setIsSaving(true);
    setError(null);
    try {
      await disciplinaService.create({
        disciplina_codigo: nome,
        ano_serie: anoSerie
      });
      // Navigate back to the dashboard
      navigate('/');
    } catch (err) {
      console.error('Erro ao criar disciplina:', err);
      setError("Erro ao salvar a disciplina. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-2xl">
        <PageHeader
          title="Criar Nova Disciplina"
          subtitle="Cadastre uma nova disciplina para gerenciar"
          backTo="/"
          backLabel="Voltar ao Dashboard"
        />

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          {/* Nome da Disciplina */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-base font-medium">
              Nome da Disciplina
            </Label>
            <Select value={nome} onValueChange={setNome} disabled={isSaving}>
              <SelectTrigger id="nome" className="w-full text-lg py-6">
                <SelectValue placeholder="Selecione a disciplina" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DISCIPLINA_NOMES).map(([codigo, label]) => (
                  <SelectItem key={codigo} value={codigo}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              O nome oficial da disciplina.
            </p>
          </div>

          {/* Ano/Série */}
          <div className="space-y-2">
            <Label htmlFor="anoSerie" className="text-base font-medium">
              Ano / Série
            </Label>
            <Select value={anoSerie} onValueChange={setAnoSerie} disabled={isSaving}>
              <SelectTrigger id="anoSerie" className="w-full text-lg py-6">
                <SelectValue placeholder="Selecione o ano/série" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ANO_SERIE_MAP).map(([codigo, label]) => (
                  <SelectItem key={codigo} value={codigo}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              A turma ou série específica desta disciplina.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!nome.trim() || !anoSerie.trim() || isSaving}
              className="min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Criar Disciplina"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
