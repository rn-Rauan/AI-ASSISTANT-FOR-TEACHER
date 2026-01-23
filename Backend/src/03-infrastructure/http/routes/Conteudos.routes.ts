import { FastifyInstance } from "fastify";
import { gerarController } from "../../../DI/container";

export async function gerarRoutes(fastify: FastifyInstance) {
    // Criar unidade + gerar conteúdos 
    fastify.post("/gerar/conteudos", gerarController.gerarConteudos.bind(gerarController));
    
    // Listar conteúdos de uma unidade
    fastify.get("/conteudos/:id", gerarController.listarConteudos.bind(gerarController));

    // Atualizar conteúdo gerado
    fastify.put("/conteudos/:id", gerarController.atualizarConteudo.bind(gerarController));
    
}
