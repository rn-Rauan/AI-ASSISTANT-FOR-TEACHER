import { ano_serie } from "../../02-domain/types/Ano_Serie";
import { disciplina_codigo } from "../../02-domain/types/Disciplina_codigo";

export interface DisciplinaResponseDTO {
  id: string;
  disciplinaCodigo: disciplina_codigo;
  nome: string;
  anoSerie: ano_serie;
  anoSerieNome: string;
}