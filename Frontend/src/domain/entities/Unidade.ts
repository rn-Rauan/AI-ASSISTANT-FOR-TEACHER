export interface Unidade {
    id: string;
    disciplina_id: string;
    tema: string;
    criadoEm?: string; // No front geralmente recebemos data como string JSON
}