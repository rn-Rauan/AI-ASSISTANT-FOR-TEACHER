import { FastifyInstance } from "fastify";
import { prismaClient } from "../../prisma/client";
import { PrismaDisciplinaRepository } from "../../db/repositories/Diciplina.Repository";
import { CriarDisciplinaUseCase } from "../../../01-application/usecases/CriarDiciplinaUseCase";
import { DisciplinaController } from "../controllers/Disciplina.controller";

const disciplinaRepository = new PrismaDisciplinaRepository(prismaClient);
const criarDisciplinaUseCase = new CriarDisciplinaUseCase(disciplinaRepository);
const disciplinaController = new DisciplinaController(criarDisciplinaUseCase);

export async function disciplinaRoutes(fastify: FastifyInstance) {
    fastify.post("/disciplinas", disciplinaController.criarDisciplina.bind(disciplinaController));

}