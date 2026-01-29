export class AtualizarConteudoUseCase {
    constructor(conteudoRepository) {
        this.conteudoRepository = conteudoRepository;
    }
    /**
     *
     * @param id ID do conteúdo a ser atualizado
     * @param novoConteudo Novo conteúdo a ser associado à unidade
     */
    async execute(id, novoConteudo) {
        if (!id || !novoConteudo) {
            throw new Error("Dever ser informado o ID e o novo conteúdo para atualização.");
        }
        if (id.trim() == "") {
            throw new Error("ID inválido.");
        }
        const conteudoExiste = await this.conteudoRepository.buscarPorID(id);
        if (!conteudoExiste) {
            throw new Error("Conteúdo não encontrado.");
        }
        conteudoExiste.Conteudo = novoConteudo;
        return await this.conteudoRepository.update(conteudoExiste);
    }
}
