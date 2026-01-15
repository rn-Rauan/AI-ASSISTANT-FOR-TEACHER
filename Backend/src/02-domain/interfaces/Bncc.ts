import { ano_serie } from "../types/Ano_Serie";
import { disciplina_codigo } from "../types/Discplina_codigo";

export interface Tema{
    tema: string;
    habilidades: string[];
}
export interface DisciplinaBncc{
    disciplina_codigo: disciplina_codigo;
    ano_serie: ano_serie;
    temas: Tema[];
}