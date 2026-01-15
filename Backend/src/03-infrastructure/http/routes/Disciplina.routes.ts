import { FastifyInstance } from "fastify";
import { prismaClient } from "../../prisma/client";
import { PrismaDisciplinaRepository } from "../../db/repositories/Disciplina.Repository";
import { CriarDisciplinaUseCase } from "../../../01-application/usecases/CriarDiciplinaUseCase";
import { DisciplinaController } from "../controllers/Disciplina.controller";
import { ListarDisciplinaUseCase } from "../../../01-application/usecases/ListarDiciplinaUsecase";
import { DeleteDisciplinaUseCase } from "../../../01-application/usecases/DeleteDisciplinaUseCase";
import { BnccService } from "../../../03-infrastructure/service/Bncc.service";


const disciplinaRepository = new PrismaDisciplinaRepository(prismaClient);
const bnccService = new BnccService();

const criarDisciplinaUseCase = new CriarDisciplinaUseCase(disciplinaRepository, bnccService);
const listarDisciplinaUseCase = new ListarDisciplinaUseCase(disciplinaRepository);
const deletarDisciplinaUseCase = new DeleteDisciplinaUseCase(disciplinaRepository);

const disciplinaController = new DisciplinaController(criarDisciplinaUseCase, listarDisciplinaUseCase, deletarDisciplinaUseCase);

export async function disciplinaRoutes(fastify: FastifyInstance) {
    //listar disciplinas
    fastify.get("/disciplinas", disciplinaController.listarDisciplinas.bind(disciplinaController));
    //criar disciplina
    fastify.post("/disciplinas", disciplinaController.criarDisciplina.bind(disciplinaController));
    //deletar disciplina
    fastify.delete("/disciplinas/:id", disciplinaController.deletarDisciplina.bind(disciplinaController));


}