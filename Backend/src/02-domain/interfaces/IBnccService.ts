import { disciplina_codigo } from "../types/Discplina_codigo";
import { ano_serie } from "../types/Ano_Serie";
import { Tema } from "../interfaces/Bncc";
export interface IBnccService {
    disciplinaValida(disciplina_codigo: disciplina_codigo, ano_serie: ano_serie ): boolean;
    getTemasPorDisciplinaESerie(disciplina_codigo: disciplina_codigo, ano_serie: ano_serie ): Tema[];
}