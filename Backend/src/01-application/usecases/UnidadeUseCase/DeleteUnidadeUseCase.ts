import { IUnidadeRepository } from "../../../02-domain/interfaces/IUnidadeRepository";

export class DeleteUnidadeUseCase {
    constructor(private unidadeRepository: IUnidadeRepository) {}

    async execute(id: string): Promise<boolean> {
        if(!id || id.trim() == "") {
            throw new Error("ID da unidade é obrigatório.");
        }

        const unidadeExistente = await this.unidadeRepository.findByID(id);

        if (!unidadeExistente) {
            throw new Error("Unidade não encontrada");
        }
        
        await this.unidadeRepository.excluir(id);
        return true;
    }
}