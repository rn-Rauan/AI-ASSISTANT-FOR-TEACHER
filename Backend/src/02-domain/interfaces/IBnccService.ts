import { disciplina_codigo } from "../types/Disciplina_codigo";
import { ano_serie } from "../types/Ano_Serie";


export interface DisciplinaBnccSimples {
  disciplina_codigo: string;
  ano_serie: string;
}

export interface IBnccService {
  disciplinaValida(
    disciplina_codigo: disciplina_codigo,
    ano_serie: ano_serie
  ): boolean;
}
