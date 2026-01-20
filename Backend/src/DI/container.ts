import { prismaClient } from "../03-infrastructure/prisma/client";
import { PrismaDisciplinaRepository } from "../03-infrastructure/db/repositories/Disciplina.Repository";
import { BnccService } from "../03-infrastructure/service/Bncc.service";
import { RagBnccService } from "../03-infrastructure/service/RAG_Bncc.service";
import { CriarDisciplinaUseCase } from "../01-application/usecases/DisciplinaUseCases/CriarDisciplinaUseCase";
import { DeleteDisciplinaUseCase } from "../01-application/usecases/DisciplinaUseCases/DeleteDisciplinaUseCase";
import { DisciplinaController } from "../03-infrastructure/http/controllers/Disciplina.controller";
import { CriarUnidadeUseCase } from "../01-application/usecases/UnidadeUseCase/CriarUnidadeUseCase";
import { UnidadeController } from "../03-infrastructure/http/controllers/Unidade.controller";
import { PrismaUnidadeRepository } from "../03-infrastructure/db/repositories/Unidade.Repository";
import { ListarUnidadesUseCase } from "../01-application/usecases/UnidadeUseCase/ListarUnidadesUseCase";
import { ListarDisciplinaPorIDUseCase } from "../01-application/usecases/DisciplinaUseCases/ListarDisciplinaPorIDUseCase";
import { BuscarUnidadePorIDUseCase } from "../01-application/usecases/UnidadeUseCase/BuscarUnidadePorIDUseCase";
import { ListarDisciplinaUseCase } from "../01-application/usecases/DisciplinaUseCases/ListarDisciplinaUseCase";
import { DeleteUnidadeUseCase } from "../01-application/usecases/UnidadeUseCase/DeleteUnidadeUseCase";
import { SugerirTemasUseCase } from "../01-application/usecases/TemasUseCase/SugerirTemasUseCase";
import { OpenAIService } from "../03-infrastructure/service/AI.service";
import { TemasController } from "../03-infrastructure/http/controllers/Temas.controller";

//Container de Injeção de Dependências

//Este arquivo contém a configuração do container de injeção de dependências para a aplicação.
//Ele define os repositórios, serviços e use cases necessários para a execução da aplicação.

/**
 * @Repositories
 * */
//Disciplina repository
const disciplinaRepository = new PrismaDisciplinaRepository(prismaClient);
const unidadeRepository = new PrismaUnidadeRepository(prismaClient);

/**
 * @Services
 */
//BNCC Service (chama os services que acessam o arquivo JSON da BNCC para sugerir conteúdos e fazer validações)
const bnccService = new BnccService();
//RAG Service (consulta API de RAG)
export const ragBnccService = new RagBnccService("http://192.168.1.6:3001");
//OpenAI Service
const openAIService = new OpenAIService(process.env.OPENAI_API_KEY || "");

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
  disciplinaRepository
);
const listarUnidadesUseCase = new ListarUnidadesUseCase(
  unidadeRepository,
  disciplinaRepository
);
const listarUnidadesPorIdUseCase = new BuscarUnidadePorIDUseCase(
  unidadeRepository
)
const deletarUnidadeUseCase = new DeleteUnidadeUseCase(
  unidadeRepository
);

//Temas Use Cases
const sugerirTemasUseCase = new SugerirTemasUseCase(
  disciplinaRepository,
  openAIService
);

/**
 * @Controllers
 * */
//Disciplina Controller
export const disciplinaController = new DisciplinaController(
  criarDisciplinaUseCase,
  listarDisciplinaUseCase,
  deletarDisciplinaUseCase,
  listarDisciplinaPorIDUseCase,
  sugerirTemasUseCase
);

//Unidade Controller
export const unidadeController = new UnidadeController(
  criarUnidadeUseCase,
  listarUnidadesUseCase,
  listarUnidadesPorIdUseCase,
  deletarUnidadeUseCase
);

//Temas Controller
export const temasController = new TemasController(
  sugerirTemasUseCase
);