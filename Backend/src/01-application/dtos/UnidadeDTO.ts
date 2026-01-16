import { origem_tema } from "../../02-domain/types/Origem_Tema";

/**
 * Data Transfer Object para Unidade
 * @param disciplina_id ID da disciplina associada
 * @param tema Tema da unidade
 * @param origem_tema Origem do tema da unidade
 */
export interface UnidadeDTO {
    disciplina_id: string;
    tema: string;
    origem_tema: origem_tema;
}