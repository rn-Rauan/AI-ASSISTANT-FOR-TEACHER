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
    constructor(AIService, unidadeRepository, disciplinaRepository, ragBnccService, conteudoGeradoRepository) {
        this.AIService = AIService;
        this.unidadeRepository = unidadeRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.ragBnccService = ragBnccService;
        this.conteudoGeradoRepository = conteudoGeradoRepository;
    }
    /**
     *
     * @param disciplina_id ID da disciplina associada
     * @param tema Tema da unidade
     * @param tipos Tipos de conteúdo a serem gerados
     * @param observacoes Observações ou contexto adicional do professor
     * @returns DTO com unidade criada e seus conteúdos gerados
     */
    async execute(disciplina_id, tema, tipos, observacoes) {
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
        const novaUnidade = new Unidade("", // ID será gerado pelo banco
        disciplina_id, tema);
        const unidadeCriada = await this.unidadeRepository.criar(novaUnidade);
        // Quando gera plano_de_aula, a IA também retorna o conteúdo para slides
        // Vamos armazenar para usar depois
        let conteudoSlidesGerado = null;
        const promessas = tiposFiltrados.map(async (tipo) => {
            let conteudoTexto;
            let contextoCompleto = `${contextoBNCC}\n\n${diretrizesTexto}`;
            if (observacoes) {
                contextoCompleto += `\n\nObservações ou contexto adicional do professor: ${observacoes}`;
            }
            switch (tipo) {
                case "plano_de_aula":
                    const resultado = await this.AIService.gerarPlanoDeAula(tema, contextoCompleto, disciplinaNome, anoSerieNome);
                    conteudoTexto = resultado.planoDeAula;
                    // Armazena o conteúdo de slides para uso posterior
                    conteudoSlidesGerado = resultado.conteudoSlides;
                    break;
                case "atividade":
                    conteudoTexto = await this.AIService.gerarAtividade(tema, contextoCompleto, disciplinaNome, anoSerieNome);
                    break;
                case "slide":
                    // Se já gerou plano de aula, usa o conteúdo de slides dele
                    // Senão, gera um plano só para extrair o conteúdo de slides
                    if (!conteudoSlidesGerado) {
                        const resultadoSlide = await this.AIService.gerarPlanoDeAula(tema, contextoCompleto, disciplinaNome, anoSerieNome);
                        conteudoTexto = resultadoSlide.conteudoSlides;
                    }
                    else {
                        conteudoTexto = conteudoSlidesGerado;
                    }
                    break;
                default:
                    throw new Error(`Tipo ${tipo} não implementado`);
            }
            // Garantir que conteudoTexto seja sempre uma string
            const conteudoString = typeof conteudoTexto == 'string'
                ? conteudoTexto
                : JSON.stringify(conteudoTexto);
            const novoConteudo = new ConteudoGerado("", unidadeCriada.UnidadeID, tipo, conteudoString);
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
