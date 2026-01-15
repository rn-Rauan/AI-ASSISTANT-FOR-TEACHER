import { IDisciplinaRepository } from "../../02-domain/interfaces/IDisciplinaRepository";

export class DeleteDisciplinaUseCase {
  constructor(private disciplinaRepository: IDisciplinaRepository) {}
  async execute(id: string): Promise<boolean> {
    const disciplinaExistente = await this.disciplinaRepository.findByID(id);
    if (!disciplinaExistente) {
      throw new Error("Disciplina não encontrada");
    }
    await this.disciplinaRepository.excluir(id);
    return true;
  }
}
