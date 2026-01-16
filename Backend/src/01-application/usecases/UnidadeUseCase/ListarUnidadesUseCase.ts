import { Unidade } from "../../../02-domain/entities/Unidade";
import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";
import { IUnidadeRepository } from "../../../02-domain/interfaces/IUnidadeRepository";

export class ListarUnidadesUseCase {
    /**
     * @param unidadeRepository repositório de unidades
     * @param disciplinaRepository repositório de disciplinas
     */
  constructor(
    private unidadeRepository: IUnidadeRepository,
    private disciplinaRepository: IDisciplinaRepository
  ) {}

  /**
   * 
   * @param disciplina_id ID da disciplina para filtrar as unidades 
   * @returns Lista de unidades de una disciplina específica
   */
  async execute(disciplina_id?: string): Promise<Unidade[]> {
    if (!disciplina_id) {
      throw new Error(
        "O ID da disciplina é obrigatório para listar as unidades."
      );
    }

    const disciplinaExiste = await this.disciplinaRepository.findByID(
      disciplina_id
    );

    if (!disciplinaExiste) {
      throw new Error("Disciplina não encontrada.");
    }
    
    const unidades = await this.unidadeRepository.listar(
      disciplinaExiste.DisciplinaID
    );
    return unidades;
  }
}
