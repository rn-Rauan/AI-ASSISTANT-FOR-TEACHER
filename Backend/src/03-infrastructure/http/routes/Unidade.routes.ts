import { FastifyInstance } from "fastify"
import { unidadeController } from "../../../DI/container";

export function unidadeRoutes(fastify: FastifyInstance) {
    // Listar unidades de uma disciplina
    fastify.get("/unidades", unidadeController.listarUnidades.bind(unidadeController));
    
    // Obter unidade por ID
    fastify.get("/unidades/:id", unidadeController.buscarUnidadePorID.bind(unidadeController));
    
    // Deletar unidade
    fastify.delete("/unidades/:id", unidadeController.deleteUnidade.bind(unidadeController));
    
    // Use  /gerar/conteudos para criar unidade + conteúdos de uma vez (Gerar.routes.ts)
    //fastify.post("/unidades", unidadeController.criarUnidade.bind(unidadeController));
}