import { FastifyInstance } from "fastify";
import { disciplinaController } from "../../../DI/container";

export async function disciplinaRoutes(fastify: FastifyInstance) {
    //listar disciplinas
    fastify.get("/disciplinas", disciplinaController.listarDisciplinas.bind(disciplinaController));
    //criar disciplina
    fastify.post("/disciplinas", disciplinaController.criarDisciplina.bind(disciplinaController));
    //deletar disciplina
    fastify.delete("/disciplinas/:id", disciplinaController.deletarDisciplina.bind(disciplinaController));
    //obter disciplina por id
    fastify.get("/disciplinas/:id", disciplinaController.obterDisciplinaPorID.bind(disciplinaController));

}