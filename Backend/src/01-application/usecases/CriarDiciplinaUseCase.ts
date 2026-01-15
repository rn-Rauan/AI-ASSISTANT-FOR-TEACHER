import { Disciplina } from "../../02-domain/entities/Disciplina";
import { IDisciplinaRepository } from "../../02-domain/interfaces/IDisciplinaRepository";
import { DisciplinaDTO } from "../dtos/DisciplinaDTO";

export class CriarDisciplinaUseCase {
    
    /**
     * Caso de uso para criar uma nova disciplina
     * @param disciplinaRepository injeção do repositório de disciplinas
     */
    constructor(private disciplinaRepository: IDisciplinaRepository){}

    /**
     * @param disciplinaDTO Dados da disciplina a ser criada
     * @returns Disciplina criada
     */
    async execute(disciplinaDTO: DisciplinaDTO){
        const disciplina = new Disciplina(
            '', //id gerado no banco
            disciplinaDTO.disciplina_codigo,
            disciplinaDTO.ano_serie
        );
        return await this.disciplinaRepository.criar(disciplina);
    }
}