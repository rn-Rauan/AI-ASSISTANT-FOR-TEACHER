export const ano_serie_map = {
    "6_ANO": "6º Ano Fundamental",
    "7_ANO": "7º Ano Fundamental",
    "8_ANO": "8º Ano Fundamental",
    "9_ANO": "9º Ano Fundamental",
    "1_SERIE": "1ª Série Ensino Médio",
    "2_SERIE": "2ª Série Ensino Médio",
    "3_SERIE": "3ª Série Ensino Médio",
};
export function obterNomeAnoSerie(codigo) {
    return ano_serie_map[codigo] || codigo;
}
