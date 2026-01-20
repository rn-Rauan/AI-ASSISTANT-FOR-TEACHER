import { FastifyInstance } from "fastify"
import { unidadeController } from "../../../DI/container";

export function unidadeRoutes(fastify: FastifyInstance) {
    //criar unidade
    fastify.post("/unidades", unidadeController.criarUnidade.bind(unidadeController));
    //listar unidades
    fastify.get("/unidades", unidadeController.listarUnidades.bind(unidadeController));
    //obter unidade por id
    fastify.get("/unidades/:id", unidadeController.buscarUnidadePorID.bind(unidadeController));
    //deletar unidade
    fastify.delete("/unidades/:id", unidadeController.deleteUnidade.bind(unidadeController));
    
}