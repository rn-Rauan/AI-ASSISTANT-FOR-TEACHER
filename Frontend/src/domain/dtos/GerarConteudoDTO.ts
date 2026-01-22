export interface GerarConteudoDTO {
    disciplina_id: string;
    tema: string;
    observacoes?: string;
    tipos: string[]; // ["plano_de_aula", "atividade", "slide"]
}
