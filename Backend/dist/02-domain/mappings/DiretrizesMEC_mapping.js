import * as diretrizesMEC from '../../04-data/diretrizes_mec.json';
/**
 * Formata as diretrizes do MEC sobre Cultura Digital em um texto
 * para ser usado como contexto para a IA.
 */
export function obterContextoDiretrizesMEC() {
    const diretrizes = diretrizesMEC.competencia_geral_5;
    const diretrizesTexto = `
Diretrizes do MEC sobre Cultura Digital (Competência Geral 5):
- Descrição: ${diretrizes.descricao}
- Princípios a seguir: ${diretrizes.principios[0]}, ${diretrizes.principios[2]}, ${diretrizes.principios[3]}.
- Orientações para a IA: ${diretrizes.orientacoes_para_ia.join(', ')}.
    `;
    return diretrizesTexto.trim();
}
