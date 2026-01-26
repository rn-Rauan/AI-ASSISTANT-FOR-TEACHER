import { FastifyInstance } from "fastify";
import { slideController } from "../../../DI/container";

export async function slideRoutes(fastify: FastifyInstance) {
    // Download do PPTX
    fastify.get("/slides/:id/download", slideController.downloadPPTX.bind(slideController));
    
    // Preview do conteúdo markdown dos slides
    fastify.get("/slides/:id/preview", slideController.previewSlides.bind(slideController));
}
