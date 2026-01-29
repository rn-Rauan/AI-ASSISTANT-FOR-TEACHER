import { prismaClient } from "../03-infrastructure/prisma/client";
import { PrismaDisciplinaRepository } from "../03-infrastructure/db/repositories/Disciplina.Repository";
import { PrismaUnidadeRepository } from "../03-infrastructure/db/repositories/Unidade.Repository";
import { PrismaConteudoGeradoRepository } from "../03-infrastructure/db/repositories/ConteudoGerado.Repository";
import { BnccService } from "../03-infrastructure/service/Bncc.service";
import { RagBnccService } from "../03-infrastructure/service/RAG_Bncc.service";
import { CriarDisciplinaUseCase } from "../01-application/usecases/DisciplinaUseCases/CriarDisciplinaUseCase";
import { DeleteDisciplinaUseCase } from "../01-application/usecases/DisciplinaUseCases/DeleteDisciplinaUseCase";
import { DisciplinaController } from "../03-infrastructure/http/controllers/Disciplina.controller";
import { UnidadeController } from "../03-infrastructure/http/controllers/Unidade.controller";
import { ListarUnidadesUseCase } from "../01-application/usecases/UnidadeUseCase/ListarUnidadesUseCase";
import { ListarDisciplinaPorIDUseCase } from "../01-application/usecases/DisciplinaUseCases/ListarDisciplinaPorIDUseCase";
import { BuscarUnidadePorIDUseCase } from "../01-application/usecases/UnidadeUseCase/BuscarUnidadePorIDUseCase";
import { ListarDisciplinaUseCase } from "../01-application/usecases/DisciplinaUseCases/ListarDisciplinaUseCase";
import { DeleteUnidadeUseCase } from "../01-application/usecases/UnidadeUseCase/DeleteUnidadeUseCase";
import { SugerirTemasUseCase } from "../01-application/usecases/TemasUseCase/SugerirTemasUseCase";
import { OpenAIService } from "../03-infrastructure/service/AI.service";
import { TemasController } from "../03-infrastructure/http/controllers/Temas.controller";
import { GerarUnidadeEConteudosUseCase } from "../01-application/usecases/ConteudoUseCase/GerarUnidadeEConteudosUseCase";
import { ListarConteudosUseCase } from "../01-application/usecases/ConteudoUseCase/ListarConteudosUseCase";
import { GerarController } from "../03-infrastructure/http/controllers/Conteudos.controller";
import { AtualizarConteudoUseCase } from "../01-application/usecases/ConteudoUseCase/AtualizarConteudoUseCase";
import { RefinarConteudoUseCase } from "../01-application/usecases/ConteudoUseCase/RefinarConteudoUseCase";
import { SlideService } from "../03-infrastructure/service/Slide.service";
import { GerarPPTXUseCase } from "../01-application/usecases/SlideUseCase/GerarPPTXUseCase";
import { BuscarPreviewSlideUseCase } from "../01-application/usecases/SlideUseCase/BuscarPreviewSlideUseCase";
import { SlideController } from "../03-infrastructure/http/controllers/Slide.controller";
import { RefinarConteudoPreviewUseCase } from "../01-application/usecases/ConteudoUseCase/RefinarConteudoPreviewUseCase";

//Container de Injeção de Dependências

//Este arquivo contém a configuração do container de injeção de dependências para a aplicação.
//Ele define os repositórios, serviços e use cases necessários para a execução da aplicação.

/**
 * @Repositories
 * */
//Disciplina repository
const disciplinaRepository = new PrismaDisciplinaRepository(prismaClient);
//Unidade repository
const unidadeRepository = new PrismaUnidadeRepository(prismaClient);
//ConteudoGerado repository
const conteudoGeradoRepository = new PrismaConteudoGeradoRepository(prismaClient);

/**
 * @Services
 */
//BNCC Service (chama os services que acessam o arquivo JSON da BNCC para sugerir conteúdos e fazer validações)
const bnccService = new BnccService();
//RAG Service (consulta API de RAG)
const ragBnccService = new RagBnccService(process.env.RAG_API_URL || "");
console.log("RAG API URL:", process.env.RAG_API_URL);
//OpenAI Service
const openAIService = new OpenAIService(process.env.OPENAI_API_KEY || "");
//Slide Service
const slideService = new SlideService();

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
const listarUnidadesUseCase = new ListarUnidadesUseCase(
  unidadeRepository,
  disciplinaRepository
);
const listarUnidadesPorIdUseCase = new BuscarUnidadePorIDUseCase(
  unidadeRepository,
  conteudoGeradoRepository
)
const deletarUnidadeUseCase = new DeleteUnidadeUseCase(
  unidadeRepository
);

//Temas Use Cases
const sugerirTemasUseCase = new SugerirTemasUseCase(
  disciplinaRepository,
  openAIService
);

//Conteúdo Use Cases
const gerarUnidadeEConteudosUseCase = new GerarUnidadeEConteudosUseCase(
  openAIService,
  unidadeRepository,
  disciplinaRepository,
  ragBnccService,
  conteudoGeradoRepository
);
const listarConteudosUseCase = new ListarConteudosUseCase(
  conteudoGeradoRepository
);
const atualizarConteudoUseCase = new AtualizarConteudoUseCase(
  conteudoGeradoRepository
)
const refinarConteudoUseCase = new RefinarConteudoUseCase(
  conteudoGeradoRepository,
  unidadeRepository,
  openAIService
);
const refinarConteudoPreviewUseCase = new RefinarConteudoPreviewUseCase(conteudoGeradoRepository,openAIService)

//Slide Use Cases
const gerarPPTXUseCase = new GerarPPTXUseCase(
  conteudoGeradoRepository,
  slideService
);
const buscarPreviewSlideUseCase = new BuscarPreviewSlideUseCase(
  conteudoGeradoRepository
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
);

//Unidade Controller
export const unidadeController = new UnidadeController(
  listarUnidadesUseCase,
  listarUnidadesPorIdUseCase,
  deletarUnidadeUseCase
);

//Temas Controller
export const temasController = new TemasController(
  sugerirTemasUseCase
);
//Gerar Controller
export const gerarController = new GerarController(
  gerarUnidadeEConteudosUseCase,
  listarConteudosUseCase,
  atualizarConteudoUseCase,
  refinarConteudoUseCase,
  refinarConteudoPreviewUseCase
);
//Slide Controller
export const slideController = new SlideController(
  gerarPPTXUseCase,
  buscarPreviewSlideUseCase
);  