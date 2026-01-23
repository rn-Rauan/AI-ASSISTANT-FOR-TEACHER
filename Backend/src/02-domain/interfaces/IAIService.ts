export interface IAIService {
    sugerirTemasCulturaDigital(disciplina: string, anoSerie: string): Promise<string[]>;
    gerarPlanoDeAula(tema: string, contextoBNCC: string, disciplina: string, anoSerie: string): Promise<string>;
    gerarAtividade(tema: string, contextoBNCC: string, disciplina: string, anoSerie: string): Promise<string>;
    refinarPlanoDeAula(planoDeAula: string, instrucoes: string): Promise<string>;
    refinarAtividade(atividade: string, instrucoes: string): Promise<string>;
}