/**
 * UseCase para buscar preview (conteúdo Markdown) de slides
 */
export class BuscarPreviewSlideUseCase {
    /**
     * @param conteudoRepository Repositório para buscar conteúdo gerado
     */
    constructor(conteudoRepository) {
        this.conteudoRepository = conteudoRepository;
    }
    /**
     * Executa a busca do preview do slide
     * @param conteudoID ID do conteúdo tipo slide
     * @returns DTO com o conteúdo do slide em Markdown
     */
    async execute(conteudoID) {
        if (!conteudoID || conteudoID.trim().length == 0) {
            throw new Error("ID do conteúdo é obrigatório");
        }
        const conteudo = await this.conteudoRepository.buscarPorID(conteudoID);
        if (!conteudo) {
            throw new Error("Conteúdo não encontrado");
        }
        if (conteudo.Tipo != "slide") {
            throw new Error("Este conteúdo não é do tipo slide");
        }
        return {
            id: conteudo.ConteudoID,
            unidadeID: conteudo.UnidadeID,
            tipo: conteudo.Tipo,
            conteudo: conteudo.Conteudo,
            criadoEm: conteudo.CriadoEm,
        };
    }
}
