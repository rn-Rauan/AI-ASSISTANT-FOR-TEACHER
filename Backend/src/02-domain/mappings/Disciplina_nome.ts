import { disciplina_codigo } from "../types/Disciplina_codigo";

/**
 * Mapeamento de códigos de disciplina para nomes legíveis
 */
export const DISCIPLINA_NOMES: Record<disciplina_codigo, string> = {
  LP: "Língua Portuguesa",
  MA: "Matemática",
  CI: "Ciências",
  HI: "História",
  GE: "Geografia",
  AR: "Arte",
  EF: "Educação Física",
  IN: "Inglês",
  LPP: "LINGUAGENS E SUAS TECNOLOGIAS",
  MAT: "MATEMÁTICA E SUAS TECNOLOGIAS",
  CHS: "CIÊNCIAS HUMANAS E SOCIAIS",
  CNT: "CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS"
};

/**
 * Função auxiliar para obter o nome de uma disciplina pelo código
 * @param codigo Código da disciplina
 * @returns Nome legível da disciplina
 */
export function obterNomeDisciplina(codigo: disciplina_codigo): string {
  return DISCIPLINA_NOMES[codigo];
}
