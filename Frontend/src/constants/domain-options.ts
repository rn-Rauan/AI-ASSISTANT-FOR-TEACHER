export const DISCIPLINA_NOMES = {
  LP: "Língua Portuguesa",
  MA: "Matemática",
  CI: "Ciências",
  HI: "História",
  GE: "Geografia",
  AR: "Arte",
  EF: "Educação Física",
  IN: "Inglês",
  LPP: "Linguagens e suas tecnologias",
  MAT: "Matemática e suas tecnologias",
  CHS: "Ciências Humana e Sociais",
  CNT: "Ciências da Natureza e suas Tecnologias"
} as const;

export const ANO_SERIE_MAP = {
  "6_ANO": "6º Ano Fundamental",
  "7_ANO": "7º Ano Fundamental",
  "8_ANO": "8º Ano Fundamental",
  "9_ANO": "9º Ano Fundamental",
  "1_SERIE": "1ª Série Ensino Médio",
  "2_SERIE": "2ª Série Ensino Médio",
  "3_SERIE": "3ª Série Ensino Médio",
} as const;

export type DisciplinaCodigo = keyof typeof DISCIPLINA_NOMES;
export type AnoSerieCodigo = keyof typeof ANO_SERIE_MAP;
