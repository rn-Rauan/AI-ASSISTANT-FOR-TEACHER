import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { disciplina_codigo } from "../../02-domain/types/Disciplina_codigo";
import { ano_serie } from "../../02-domain/types/Ano_Serie";
import { DisciplinaBnccSimples, IBnccService } from "../../02-domain/interfaces/IBnccService";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BnccService implements IBnccService {
  private bnccJson: DisciplinaBnccSimples[];

  constructor() {
    const caminho = path.resolve(__dirname, "../../04-data/mapDisciplinaAnoSerie.json");
    try {
      const data = fs.readFileSync(caminho, "utf-8");
      this.bnccJson = JSON.parse(data);
    } catch (error) {
      throw new Error("Erro ao carregar mapa de disciplina e ano/serie JSON: " + error);
    }
  }

  /**
   * Verifica se a disciplina e série são válidas conforme a BNCC
   * @param disciplina_codigo Código da disciplina
   * @param ano_serie Ano e série da disciplina
   * @returns Boolean indicando se a disciplina e série são válidas na BNCC
   */
  disciplinaValida(
    disciplina_codigo: disciplina_codigo,
    ano_serie: ano_serie
  ): boolean {
    const disciplinaEncontrada = this.bnccJson.some(
      (disciplina) =>
        disciplina.disciplina_codigo.trim() == disciplina_codigo.trim() &&
        disciplina.ano_serie == ano_serie
    );
    return disciplinaEncontrada;
  }
 
}
