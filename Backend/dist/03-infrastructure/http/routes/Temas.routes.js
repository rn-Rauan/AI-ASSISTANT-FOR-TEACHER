import { temasController } from "../../../DI/container";
export async function sugerirTemasRoutes(fastify) {
    //sugerir temas
    fastify.get("/disciplinas/:id/sugerir-temas", temasController.sugerirTemas.bind(temasController));
}
