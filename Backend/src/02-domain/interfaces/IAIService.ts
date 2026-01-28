import { ResponseRefinamento } from "../../01-application/dtos/ConteudoDTOs/ConteudoRefinadoResponseDTO";

export type ConteudoEstruturado = {
  planoDeAula: string;
  conteudoSlides: string;
};

export interface IAIService {
    sugerirTemasCulturaDigital(disciplina: string, anoSerie: string): Promise<string[]>;
    gerarPlanoDeAula(tema: string, contextoBNCC: string, disciplina: string, anoSerie: string): Promise<ConteudoEstruturado>;
    gerarAtividade(tema: string, contextoBNCC: string, disciplina: string, anoSerie: string): Promise<string>;
    refinarPlanoDeAula(planoDeAula: string, instrucoes: string): Promise<ResponseRefinamento>;
    refinarAtividade(atividade: string, instrucoes: string): Promise<ResponseRefinamento>;
    refinarSlide(slideMarkdown: string, instrucoes: string): Promise<ResponseRefinamento>;
}