export type ConteudoEstruturado = {
  planoDeAula: string;
  conteudoSlides: string;
};

export interface IAIService {
    sugerirTemasCulturaDigital(disciplina: string, anoSerie: string): Promise<string[]>;
    gerarPlanoDeAula(tema: string, contextoBNCC: string, disciplina: string, anoSerie: string): Promise<ConteudoEstruturado>;
    gerarAtividade(tema: string, contextoBNCC: string, disciplina: string, anoSerie: string): Promise<string>;
    refinarPlanoDeAula(planoDeAula: string, instrucoes: string): Promise<string>;
    refinarAtividade(atividade: string, instrucoes: string): Promise<string>;
    refinarSlide(slideMarkdown: string, instrucoes: string): Promise<string>;
}