/**
 * Controller para operações de slides em formato PPTX
 */
export class SlideController {
    /**
     * Controlador para operações de slides
     * @param gerarPPTXUseCase Caso de uso para gerar arquivo PPTX
     * @param buscarPreviewSlideUseCase Caso de uso para buscar preview do slide
     */
    constructor(gerarPPTXUseCase, buscarPreviewSlideUseCase) {
        this.gerarPPTXUseCase = gerarPPTXUseCase;
        this.buscarPreviewSlideUseCase = buscarPreviewSlideUseCase;
    }
    /**
     * Gera e faz download de um arquivo PPTX a partir de um conteúdo tipo "slide"
     * @param req Requisição HTTP contendo o ID do conteúdo
     * @param reply Resposta HTTP com o arquivo PPTX
     */
    async downloadPPTX(req, reply) {
        try {
            const { id } = req.params;
            if (!id) {
                return reply.status(400).send({
                    message: "Campo obrigatório: id",
                });
            }
            const pptxBuffer = await this.gerarPPTXUseCase.execute(id);
            // Configurar headers para download
            const fileName = `slide-${id}.pptx`;
            reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
            reply.header('Content-Disposition', `attachment; filename="${fileName}"`);
            reply.header('Content-Length', pptxBuffer.length);
            return reply.send(pptxBuffer);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Erro desconhecido";
            console.error("Erro ao gerar PPTX:", error);
            return reply.status(500).send({
                message: "Erro ao gerar arquivo PPTX",
                error: message,
            });
        }
    }
    /**
     * Gera preview do conteúdo de slides (retorna o markdown)
     * @param req Requisição HTTP contendo o ID do conteúdo
     * @param reply Resposta HTTP com o markdown dos slides
     */
    async previewSlides(req, reply) {
        try {
            const { id } = req.params;
            if (!id) {
                return reply.status(400).send({
                    message: "Campo obrigatório: id",
                });
            }
            const preview = await this.buscarPreviewSlideUseCase.execute(id);
            return reply.status(200).send({
                ...preview,
                formato: "markdown",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Erro desconhecido";
            return reply.status(500).send({
                message: "Erro ao buscar preview dos slides",
                error: message,
            });
        }
    }
}
