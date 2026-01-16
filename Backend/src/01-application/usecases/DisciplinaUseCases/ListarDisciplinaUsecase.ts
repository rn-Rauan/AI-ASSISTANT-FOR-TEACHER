import { Disciplina } from "../../../02-domain/entities/Disciplina";
import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";

export class ListarDisciplinaUseCase {

  /**
   * Caso de uso para listar todas as disciplinas
   * @param disciplinaRepository injeção do repositório de disciplinas
   */
  constructor(private disciplinaRepository: IDisciplinaRepository) {}

  /**
   * Executa o caso de uso para listar todas as disciplinas
   * @returns Lista de disciplinas
   */
  async execute(): Promise<Disciplina[]> {
    return await this.disciplinaRepository.listar();
  }
}
