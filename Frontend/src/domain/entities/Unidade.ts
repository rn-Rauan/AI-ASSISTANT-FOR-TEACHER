import type{ Conteudo } from './Conteudo';

export interface Unidade {
    id: string;
    disciplinaID: string;
    tema: string;
    criadoEm?: string;
    conteudos?: Conteudo[]; // No front geralmente recebemos data como string JSON
}