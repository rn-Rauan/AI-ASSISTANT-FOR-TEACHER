export class DeleteDisciplinaUseCase {
    /**
     * Caso de uso para excluir uma disciplina existente
     * @param disciplinaRepository injeção do repositório de disciplinas
     */
    constructor(disciplinaRepository) {
        this.disciplinaRepository = disciplinaRepository;
    }
    /**
     * Executa o caso de uso para excluir uma disciplina existente
     * @param id ID da disciplina a ser excluída
     * @returns Retorna true se a exclusão for bem-sucedida
     */
    async execute(id) {
        if (!id || id.trim() == "") {
            throw new Error("ID da disciplina é obrigatório.");
        }
        const disciplinaExistente = await this.disciplinaRepository.findByID(id);
        if (!disciplinaExistente) {
            throw new Error("Disciplina não encontrada");
        }
        await this.disciplinaRepository.excluir(id);
        return true;
    }
}
