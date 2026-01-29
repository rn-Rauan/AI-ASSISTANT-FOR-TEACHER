export class DeleteUnidadeUseCase {
    constructor(unidadeRepository) {
        this.unidadeRepository = unidadeRepository;
    }
    async execute(id) {
        if (!id || id.trim() == "") {
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
