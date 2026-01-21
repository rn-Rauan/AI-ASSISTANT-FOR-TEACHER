import { OpenAIService } from "../../../03-infrastructure/service/AI.service";
import { IUnidadeRepository } from "../../../02-domain/interfaces/IUnidadeRepository";
import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";
import { IRagBnccService } from "../../../02-domain/interfaces/IRagBnccService";
import { IConteudoGeradoRepository } from "../../../02-domain/interfaces/IConteudoGeradoRepository";
import { CriarUnidadeComConteudosResponseDTO } from "../../dtos/UnidadeDTOs/CriarUnidadeComConteudosResponseDTO";
import { obterNomeDisciplina } from "../../../02-domain/mappings/Disciplina_nome";
import { obterNomeAnoSerie } from "../../../02-domain/mappings/Ano_Serie_nome";
import { obterContextoDiretrizesMEC } from "../../../02-domain/mappings/DiretrizesMEC_mapping";
import { ConteudoGerado } from "../../../02-domain/entities/ConteudoGerado";
import { Unidade } from "../../../02-domain/entities/Unidade";

/**
 * UseCase para criar unidade com múltiplos conteúdos de uma vez
 * Otimizado para fazer apenas UMA chamada ao RAG
 * Este é o FLUXO PRINCIPAL de criação de unidades
 */
export class GerarUnidadeEConteudosUseCase {
    /**
     * 
     * @param AIService Serviço de IA para geração de conteúdo
     * @param unidadeRepository Repositório para acesso às unidades
     * @param disciplinaRepository Repositório para acesso às disciplinas
     * @param ragBnccService Serviço de RAG para consulta ao BNCC
     * @param conteudoGeradoRepository Repositório para persistência dos conteúdos gerados
     */
  constructor(
    private AIService: OpenAIService,
    private unidadeRepository: IUnidadeRepository,
    private disciplinaRepository: IDisciplinaRepository,
    private ragBnccService: IRagBnccService,
    private conteudoGeradoRepository: IConteudoGeradoRepository
  ) { }

  /**
   * 
   * @param disciplina_id ID da disciplina associada
   * @param tema Tema da unidade
   * @param tipos Tipos de conteúdo a serem gerados
   * @param observacoes Observações ou contexto adicional do professor
   * @returns DTO com unidade criada e seus conteúdos gerados
   */
  async execute(
    disciplina_id: string,
    tema: string,
    tipos: string[],
    observacoes?: string
  ): Promise<CriarUnidadeComConteudosResponseDTO> {
    // 1. Validar tipos
    const tiposValidos = ["plano_de_aula", "atividade", "slide"];
    const tiposFiltrados = tipos.filter(tipo => tiposValidos.includes(tipo));

    if (tiposFiltrados.length == 0) {
      throw new Error("Nenhum tipo válido fornecido. Use: plano_de_aula, atividade ou slide");
    }

    if (!tema || tema.trim().length < 2) {
      throw new Error("O tema deve ter pelo menos 2 caracteres");
    }

    const disciplina = await this.disciplinaRepository.findByID(disciplina_id);
    if (!disciplina) {
      throw new Error("Disciplina não encontrada");
    }

    const disciplinaNome = obterNomeDisciplina(disciplina.disciplinaCodigo);
    const anoSerieNome = obterNomeAnoSerie(disciplina.anoSerie);

    let queryRag = `${tema}`;

    const contextoBNCC = await this.ragBnccService.consultarBNCC({
      tema: queryRag,
      disciplina_codigo: disciplina.disciplinaCodigo,
      ano_serie: disciplina.anoSerie,
    });

    const diretrizesTexto = obterContextoDiretrizesMEC();

    const novaUnidade = new Unidade(
      "", // ID será gerado pelo banco
      disciplina_id,
      tema
    );

    const unidadeCriada = await this.unidadeRepository.criar(novaUnidade);

    const promessas = tiposFiltrados.map(async (tipo) => {
      let conteudoTexto: string;

      let contextoCompleto = `${contextoBNCC}\n\n${diretrizesTexto}`;
      if (observacoes) {
        contextoCompleto += `\n\nObservações ou contexto adicional do professor: ${observacoes}`;
      }

      switch (tipo) {
        case "plano_de_aula":
          conteudoTexto = await this.AIService.gerarPlanoDeAula(
            tema,
            contextoCompleto,
            disciplinaNome,
            anoSerieNome
          );
          break;

        case "atividade":
          conteudoTexto = await this.AIService.gerarAtividade(
            tema,
            contextoCompleto,
            disciplinaNome,
            anoSerieNome
          );
          break;

        default:
          throw new Error(`Tipo ${tipo} não implementado`);
      }

      const novoConteudo = new ConteudoGerado(
        "",
        unidadeCriada.UnidadeID,
        tipo,
        conteudoTexto
      );

      const conteudoSalvo = await this.conteudoGeradoRepository.criar(novoConteudo);

      return {
        id: conteudoSalvo.ConteudoID,
        unidadeID: conteudoSalvo.UnidadeID,
        tipo: conteudoSalvo.Tipo,
        conteudo: conteudoSalvo.Conteudo,
        criadoEm: conteudoSalvo.CriadoEm,
      };
    });

    const conteudosGerados = await Promise.all(promessas);

    return {
      unidade: {
        id: unidadeCriada.UnidadeID,
        disciplinaID: unidadeCriada.DisciplinaID,
        tema: unidadeCriada.Tema,
        criadoEm: unidadeCriada.CriadoEm,
      },
      conteudos: conteudosGerados,
    };
  }
}