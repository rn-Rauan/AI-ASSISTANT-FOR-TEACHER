import { FastifyInstance } from "fastify/types/instance";
import { temasController } from "../../../DI/container";

export async function sugerirTemasRoutes(fastify: FastifyInstance) {
    //sugerir temas
    fastify.get("/disciplinas/:id/sugerir-temas", temasController.sugerirTemas.bind(temasController));
}