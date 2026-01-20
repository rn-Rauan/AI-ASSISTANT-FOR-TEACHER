/**
 * Data Transfer Object para gerar múltiplos conteúdos
 * Este DTO cria uma nova unidade com os conteúdos gerados
 * @param disciplina_id ID da disciplina
 * @param tema Tema da unidade (digitado pelo usuário ou sugestão)
 * @param observacoes Observações adicionais para a geração (opcional)
 * @param tipos Array com os tipos de conteúdo a gerar (plano_de_aula, atividade)
 */
export interface GerarConteudosDTO {
    disciplina_id: string;
    tema: string;
    observacoes?: string;
    tipos: string[]; // ["plano_de_aula", "atividade"]
}
