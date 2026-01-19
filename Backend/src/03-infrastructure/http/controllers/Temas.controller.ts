import { FastifyReply, FastifyRequest } from "fastify";
import { SugerirTemasUseCase } from "../../../01-application/usecases/TemasUseCase/SugerirTemasUseCase";

export class TemasController {
    /**
     * Controlador para operações relacionadas a Temas
     * @param sugerirTemasUseCase Caso de uso para sugerir temas
     */
    constructor(private sugerirTemasUseCase: SugerirTemasUseCase) { }
    /**
     * 
     * @param req Requisição HTTP contendo o ID da disciplina
     * @param reply Resposta HTTP com as sugestões de temas
     */
    async sugerirTemas(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            if (!id) {
                reply.status(400).send({ error: "ID da disciplina é obrigatório." });
            }

            const sugestoes = await this.sugerirTemasUseCase.execute(id);

            reply.send(sugestoes);
        } catch (error: any) {
            reply.status(500).send({ message: "Erro ao sugerir temas", error: error.message });
        }
    }
}