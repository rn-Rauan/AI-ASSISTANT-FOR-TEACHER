import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { disciplinaService } from "@/infrastructure/services/disciplina.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { DISCIPLINA_NOMES, ANO_SERIE_MAP } from "@/constants/domain-options";

// Grupos de disciplinas por nível de ensino
const DISCIPLINAS_FUNDAMENTAL = ["LP", "MA", "CI", "HI", "GE", "AR", "EF", "IN"];
const DISCIPLINAS_MEDIO = ["LPP", "MAT", "CHS", "CNT"];

// Grupos de séries por nível de ensino
const SERIES_FUNDAMENTAL = ["6_ANO", "7_ANO", "8_ANO", "9_ANO"];
const SERIES_MEDIO = ["1_SERIE", "2_SERIE", "3_SERIE"];

interface ModalCriarDisciplinaProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const ModalCriarDisciplina = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: ModalCriarDisciplinaProps) => {
  const [nome, setNome] = useState("");
  const [anoSerie, setAnoSerie] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtrar opções de Ano/Série baseado na disciplina selecionada
  const filteredAnoOptions = useMemo(() => {
    if (!nome) return Object.entries(ANO_SERIE_MAP);

    if (DISCIPLINAS_FUNDAMENTAL.includes(nome)) {
      return Object.entries(ANO_SERIE_MAP).filter(([codigo]) => 
        SERIES_FUNDAMENTAL.includes(codigo)
      );
    }

    if (DISCIPLINAS_MEDIO.includes(nome)) {
      return Object.entries(ANO_SERIE_MAP).filter(([codigo]) => 
        SERIES_MEDIO.includes(codigo)
      );
    }

    return Object.entries(ANO_SERIE_MAP);
  }, [nome]);

  // Limpar seleção incompatível quando o nível de ensino mudar
  useEffect(() => {
    if (nome && anoSerie) {
      const isFundamentalDisciplina = DISCIPLINAS_FUNDAMENTAL.includes(nome);
      const isMedioDisciplina = DISCIPLINAS_MEDIO.includes(nome);
      
      const isFundamentalSerie = SERIES_FUNDAMENTAL.includes(anoSerie);
      const isMedioSerie = SERIES_MEDIO.includes(anoSerie);

      if (isFundamentalDisciplina && !isFundamentalSerie) {
        setAnoSerie("");
      } else if (isMedioDisciplina && !isMedioSerie) {
        setAnoSerie("");
      }
    }
  }, [nome, anoSerie]);

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
      onSuccess();
      onOpenChange(false);
      // Reset form
      setNome("");
      setAnoSerie("");
    } catch (err) {
      console.error('Erro ao criar disciplina:', err);
      setError("Erro ao salvar a disciplina. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Disciplina</DialogTitle>
          <DialogDescription>
            Cadastre uma nova disciplina para gerenciar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
            <Select 
              value={anoSerie} 
              onValueChange={setAnoSerie} 
              disabled={isSaving || !nome}
            >
              <SelectTrigger id="anoSerie" className="w-full text-lg py-6">
                <SelectValue placeholder={!nome ? "Selecione primeiro a disciplina" : "Selecione o ano/série"} />
              </SelectTrigger>
              <SelectContent>
                {filteredAnoOptions.map(([codigo, label]) => (
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
