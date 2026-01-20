import { ano_serie } from "../../02-domain/types/Ano_Serie";
import { disciplina_codigo } from "../../02-domain/types/Disciplina_codigo";

/**
 * DTO de resposta para a entidade Disciplina
 * @id ID da disciplina
 * @disciplinaCodigo Código da disciplina
 * @nome Nome da disciplina traduzido
 * @anoSerie Ano/Série da disciplina
 * @anoSerieNome Nome do Ano/Série da disciplina traduzido
 */
export interface DisciplinaResponseDTO {
  id: string;
  disciplinaCodigo: disciplina_codigo;
  nome: string;
  anoSerie: ano_serie;
  anoSerieNome: string;
}