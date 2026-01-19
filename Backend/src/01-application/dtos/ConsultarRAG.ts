import { ano_serie } from "../../02-domain/types/Ano_Serie";
import { disciplina_codigo } from "../../02-domain/types/Disciplina_codigo";

export interface ConsultarRAG {
  tema: string;
  disciplina_codigo: disciplina_codigo;
  ano_serie: ano_serie;
}