export type TipoConteudo = 'plano_de_aula' | 'atividade' | 'slide';

export interface Conteudo {
    id: string;
    unidadeID: string;
    tipo: TipoConteudo;
    conteudo: string; // Markdown ou texto
    criadoEm?: string;
}