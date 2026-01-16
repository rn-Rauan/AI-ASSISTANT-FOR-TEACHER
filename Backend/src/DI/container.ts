import { prismaClient } from "../03-infrastructure/prisma/client";
import { PrismaDisciplinaRepository } from "../03-infrastructure/db/repositories/Disciplina.Repository";
import { BnccService } from "../03-infrastructure/service/Bncc.service";
import { CriarDisciplinaUseCase } from "../01-application/usecases/CriarDisciplinaUseCase";
import { DeleteDisciplinaUseCase } from "../01-application/usecases/DeleteDisciplinaUseCase";
import { ListarDisciplinaUseCase } from "../01-application/usecases/ListarDisciplinaUsecase";
import { DisciplinaController } from "../03-infrastructure/http/controllers/Disciplina.controller";

/**
 * Container de Injeção de Dependências
 * 
 * Este arquivo contém a configuração do container de injeção de dependências para a aplicação.
 * Ele define os repositórios, serviços e use cases necessários para a execução da aplicação.
 * 
 * @module container
 * */

/**
 * @RepositoriesServices
 * */
//Disciplina repository
export const disciplinaRepository = new PrismaDisciplinaRepository(
  prismaClient
);
//BNCC Service (chama os services que acessam o arquivo JSON da BNCC)
const bnccService = new BnccService();

/**
 * @UseCases
 * */
//Disciplina Use Case
const criarDisciplinaUseCase = new CriarDisciplinaUseCase(
  disciplinaRepository,
  bnccService
);
const listarDisciplinaUseCase = new ListarDisciplinaUseCase(
  disciplinaRepository
);
const deletarDisciplinaUseCase = new DeleteDisciplinaUseCase(
  disciplinaRepository
);

/**
 * @Controllers
 * */
//Disciplina Controller
export const disciplinaController = new DisciplinaController(
  criarDisciplinaUseCase,
  listarDisciplinaUseCase,
  deletarDisciplinaUseCase
);
