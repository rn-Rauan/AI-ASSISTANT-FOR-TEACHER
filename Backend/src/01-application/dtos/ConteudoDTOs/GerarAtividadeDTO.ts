/**
 * Data Transfer Object para gerar atividade
 * @deprecated Use GerarConteudosDTO para criar unidade + conteúdos de uma vez
 * @param disciplina_id ID da disciplina
 * @param tema Tema da unidade
 * @param observacoes Observações adicionais (opcional)
 */
export interface GerarAtividadeDTO {
    disciplina_id: string;
    tema: string;
    observacoes?: string;
}
