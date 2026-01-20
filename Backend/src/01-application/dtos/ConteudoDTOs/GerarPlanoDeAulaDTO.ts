/**
 * Data Transfer Object para gerar plano de aula
 * @deprecated Use GerarConteudosDTO para criar unidade + conteúdos de uma vez
 * @param disciplina_id ID da disciplina
 * @param tema Tema da unidade
 * @param observacoes Observações adicionais (opcional)
 */
export interface GerarPlanoDeAulaDTO {
    disciplina_id: string;
    tema: string;
    observacoes?: string;
}
