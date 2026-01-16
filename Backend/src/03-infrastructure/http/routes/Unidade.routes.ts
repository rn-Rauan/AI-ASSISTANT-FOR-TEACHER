import { FastifyInstance } from "fastify"
import { unidadeController } from "../../../DI/container";

export function unidadeRoutes(fastify: FastifyInstance) {
    fastify.post("/unidades", unidadeController.criarUnidade.bind(unidadeController));
}