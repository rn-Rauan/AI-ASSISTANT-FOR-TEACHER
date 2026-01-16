import { IDisciplinaRepository } from "../../02-domain/interfaces/IDisciplinaRepository";

export class ListarDisciplinaUseCase {
  constructor(private disciplinaRepository: IDisciplinaRepository) {}
  async execute() {
    return await this.disciplinaRepository.listar();
  }
}
