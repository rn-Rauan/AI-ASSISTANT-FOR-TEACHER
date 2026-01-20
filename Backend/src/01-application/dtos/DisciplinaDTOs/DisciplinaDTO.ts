import { ano_serie } from "../../../02-domain/types/Ano_Serie";
import { disciplina_codigo } from "../../../02-domain/types/Disciplina_codigo";

/**
 * Data Transfer Object para Disciplina
 * @param disciplina_codigo Código da disciplina
 * @param ano_serie Ano ou série da disciplina
 */
export interface DisciplinaDTO {
    disciplina_codigo: disciplina_codigo;
    ano_serie: ano_serie;
}