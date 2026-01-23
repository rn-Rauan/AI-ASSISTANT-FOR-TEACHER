export interface HabilidadesBNCC {
    codigo: string;
    descricao: string;
}

export interface ContextoPedagogico {
    abordagem: string;
    nivelCognitivo: string;
    estrategias: string[];
    metodologias: string[];
}

export interface CulturaDigital {
    relacao: string;
    tecnologias: string[];
    recursos: string[];
    competenciasDigitais: string[];
}

export interface ContextoRAG {
    tema: string;
    serie: string; 
    disciplina: string;
    habilidadesBNCC: HabilidadesBNCC[];
    contextoPedagogico: ContextoPedagogico;
    culturaDigital: CulturaDigital;
    sugestoesConteudo: string[];
}

export interface Fonte {
    url: string;
    tipo: string;
}

export interface Metadados{
    tema: string;
    disciplina: string;
    serie: string;
    bimestre: null | string;
    timestamp: string;
}

export interface RagApiResponseDTO {
    contexto: ContextoRAG;
    bnccReferencia: string;
    fontes: Fonte[];
    metadados: Metadados;
}