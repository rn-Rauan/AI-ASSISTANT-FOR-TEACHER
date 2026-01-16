import { prismaClient } from "../03-infrastructure/prisma/client";
import { PrismaDisciplinaRepository } from "../03-infrastructure/db/repositories/Disciplina.Repository";
import { BnccService } from "../03-infrastructure/service/Bncc.service";
import { CriarDisciplinaUseCase } from "../01-application/usecases/DisciplinaUseCases/CriarDisciplinaUseCase";
import { DeleteDisciplinaUseCase } from "../01-application/usecases/DisciplinaUseCases/DeleteDisciplinaUseCase";
import { ListarDisciplinaUseCase } from "../01-application/usecases/DisciplinaUseCases/ListarDisciplinaUsecase";
import { DisciplinaController } from "../03-infrastructure/http/controllers/Disciplina.controller";
import { CriarUnidadeUseCase } from "../01-application/usecases/UnidadeUseCase/CriarUnidadeUseCase";
import { UnidadeController } from "../03-infrastructure/http/controllers/Unidade.controller";
import { PrismaUnidadeRepository } from "../03-infrastructure/db/repositories/Unidade.Repository";
import { ListarUnidadesUseCase } from "../01-application/usecases/UnidadeUseCase/ListarUnidadesUseCase";
import { ListarDisciplinaPorIDUseCase } from "../01-application/usecases/DisciplinaUseCases/ListarDisciplinaPorIDUseCase";

//Container de Injeção de Dependências

//Este arquivo contém a configuração do container de injeção de dependências para a aplicação.
//Ele define os repositórios, serviços e use cases necessários para a execução da aplicação.

/**
 * @RepositoriesServices
 * */
//Disciplina repository
const disciplinaRepository = new PrismaDisciplinaRepository(prismaClient);
const unidadeRepository = new PrismaUnidadeRepository(prismaClient);
//BNCC Service (chama os services que acessam o arquivo JSON da BNCC)
const bnccService = new BnccService();

/**
 * @UseCases
 * */
//Disciplina Use Cases
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
const listarDisciplinaPorIDUseCase = new ListarDisciplinaPorIDUseCase(
  disciplinaRepository
);

//Unidade Use Cases
const criarUnidadeUseCase = new CriarUnidadeUseCase(
  unidadeRepository,
  disciplinaRepository,
  bnccService
);
const listarUnidadesUseCase = new ListarUnidadesUseCase(
  unidadeRepository,
  disciplinaRepository
);

/**
 * @Controllers
 * */
//Disciplina Controller
export const disciplinaController = new DisciplinaController(
  criarDisciplinaUseCase,
  listarDisciplinaUseCase,
  deletarDisciplinaUseCase,
  listarDisciplinaPorIDUseCase
);

//Unidade Controller
export const unidadeController = new UnidadeController(
  criarUnidadeUseCase,
  listarUnidadesUseCase
);
