import { disciplina_codigo } from "../types/Disciplina_codigo";
import { ano_serie } from "../types/Ano_Serie";
import { Tema } from "../interfaces/Bncc";
export interface IBnccService {
    disciplinaValida(disciplina_codigo: disciplina_codigo, ano_serie: ano_serie ): Promise<boolean>;
    getTemasPorDisciplinaESerie(disciplina_codigo: disciplina_codigo, ano_serie: ano_serie ): Promise<Tema[]>;
    validarTemaBncc(tema: string): Promise<boolean>;
}