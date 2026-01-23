export type TipoConteudo = 'plano_de_aula' | 'atividade' | 'slide';

export interface Conteudo {
    id: string;
    unidade_id: string;
    tipo: TipoConteudo;
    conteudo: string; // Markdown ou texto
    criadoEm?: string;
}