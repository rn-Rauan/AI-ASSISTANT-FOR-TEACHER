export class TemasController {
    /**
     * Controlador para operações relacionadas a Temas
     * @param sugerirTemasUseCase Caso de uso para sugerir temas
     */
    constructor(sugerirTemasUseCase) {
        this.sugerirTemasUseCase = sugerirTemasUseCase;
    }
    /**
     *
     * @param req Requisição HTTP contendo o ID da disciplina
     * @param reply Resposta HTTP com as sugestões de temas
     */
    async sugerirTemas(req, reply) {
        try {
            const { id } = req.params;
            if (!id) {
                return reply.status(400).send({ message: "ID da disciplina é obrigatório." });
            }
            const sugestoes = await this.sugerirTemasUseCase.execute(id);
            return reply.status(200).send(sugestoes);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Erro desconhecido";
            return reply.status(500).send({ message: "Erro ao sugerir temas", error: message });
        }
    }
}
