/**
 * UseCase para gerar arquivo PPTX a partir de conteúdo tipo slide
 */
export class GerarPPTXUseCase {
    /**
     * @param conteudoRepository Repositório para buscar conteúdo gerado
     * @param slideService Serviço para gerar arquivo PPTX
     */
    constructor(conteudoRepository, slideService) {
        this.conteudoRepository = conteudoRepository;
        this.slideService = slideService;
    }
    /**
     * Executa a geração do arquivo PPTX
     * @param conteudoID ID do conteúdo tipo slide
     * @param tema Título da apresentação (opcional)
     * @returns Buffer do arquivo PPTX gerado
     */
    async execute(conteudoID, tema) {
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
        const pptxBuffer = await this.slideService.gerarPPTX(conteudo.Conteudo, tema || "Apresentação");
        return pptxBuffer;
    }
}
