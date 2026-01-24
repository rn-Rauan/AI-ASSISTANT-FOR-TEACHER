export interface Disciplina {
    id: string;
    disciplina_codigo: string;
    ano_serie: string;
    // Campos adicionais retornados pelo DTO do backend
    nome?: string;
    anoSerieNome?: string;
}