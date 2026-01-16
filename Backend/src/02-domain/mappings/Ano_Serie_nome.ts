import { ano_serie } from "../types/Ano_Serie";

export const ano_serie_map: Record<ano_serie, string> = {
  "6_ANO": "6º Ano",
  "7_ANO": "7º Ano",
  "8_ANO": "8º Ano",
  "9_ANO": "9º Ano",
  "1_SERIE": "1ª Série",
  "2_SERIE": "2ª Série",
  "3_SERIE": "3ª Série",
};

export function obterNomeAnoSerie(codigo: ano_serie): string {
  return ano_serie_map[codigo] || codigo;
}