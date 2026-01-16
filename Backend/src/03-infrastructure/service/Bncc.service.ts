import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { DisciplinaBncc, Tema } from "../../02-domain/interfaces/Bncc";
import { disciplina_codigo } from "../../02-domain/types/Disciplina_codigo";
import { ano_serie } from "../../02-domain/types/Ano_Serie";
import { IBnccService } from "../../02-domain/interfaces/IBnccService";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BnccService implements IBnccService {
  private bnccJson: DisciplinaBncc[];

  constructor() {
    const caminho = path.resolve(__dirname, "../../04-data/bncc.json");
    try {
      const data = fs.readFileSync(caminho, "utf-8");
      this.bnccJson = JSON.parse(data);
    } catch (error) {
      throw new Error("Erro ao carregar BNCC JSON: " + error);
    }
  }

  /**
   * Verifica se a disciplina e série são válidas conforme a BNCC
   * @param disciplina_codigo Código da disciplina
   * @param ano_serie Ano e série da disciplina
   * @returns Boolean indicando se a disciplina e série são válidas na BNCC
   */
  async disciplinaValida(
    disciplina_codigo: disciplina_codigo,
    ano_serie: ano_serie
  ) {
    const disciplinaEncontrada = this.bnccJson.some(
      (disciplina) =>
        disciplina.disciplina_codigo.trim() == disciplina_codigo.trim() &&
        disciplina.ano_serie == ano_serie
    );
    return disciplinaEncontrada;
  }
  /**
   * @param disciplina_codigo Código da disciplina
   * @param ano_serie Ano e série da disciplina
   * @returns Lista de temas da disciplina e série informadas
   */
  async getTemasPorDisciplinaESerie (
    disciplina_codigo: disciplina_codigo,
    ano_serie: ano_serie
  ): Promise<Tema[]> {
    const disciplina = this.bnccJson.find(
      (disciplina) =>
        disciplina.disciplina_codigo == disciplina_codigo &&
        disciplina.ano_serie == ano_serie
    );
    if (!disciplina) {
      return [];
    }
    return disciplina.temas;
  }
  /**
   * Valida se o tema existe na BNCC
   * @param tema Tema a ser validado
   * @returns Boolean indicando se o tema é válido na BNCC
   */
  async validarTemaBncc(tema: string){
    const temaFormatado = tema.trim().toLocaleUpperCase();

    for (let i: number = 0; i< this.bnccJson.length; i++) {
      for (let j: number = 0; j < this.bnccJson[i].temas.length; j++) {
        if (this.bnccJson[i].temas[j].tema.trim().toLocaleUpperCase() == temaFormatado) {
          return true;
        }
      }
    }
    return false;
  }
}
