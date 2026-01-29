import { Disciplina } from "../../../02-domain/entities/Disciplina";
import { obterNomeAnoSerie } from "../../../02-domain/mappings/Ano_Serie_nome";
import { obterNomeDisciplina } from "../../../02-domain/mappings/Disciplina_nome";
export class CriarDisciplinaUseCase {
    /**
     * Caso de uso para criar uma nova disciplina
     * @param disciplinaRepository injeção do repositório de disciplinas
     */
    constructor(disciplinaRepository, bnccService) {
        this.disciplinaRepository = disciplinaRepository;
        this.bnccService = bnccService;
    }
    /**
     * Executa o caso de uso para criar uma nova disciplina
     * @param disciplinaDTO Dados da disciplina a ser criada
     * @returns Disciplina criada
     */
    async execute(disciplinaDTO) {
        const codigoFormatado = disciplinaDTO.disciplina_codigo
            .trim()
            .toUpperCase();
        const anoSerieFormatado = disciplinaDTO.ano_serie
            .trim()
            .toUpperCase();
        const disciplinaValida = this.bnccService.disciplinaValida(codigoFormatado, anoSerieFormatado);
        if (!disciplinaValida) {
            throw new Error("Disciplina ou série inválida conforme o \"mapDisciplinaAnoSerie.json\"" +
                ` ${codigoFormatado} - ${anoSerieFormatado}` + " Verifique a documentação em /docs/API_DOCS.md");
        }
        const disciplina = new Disciplina("", //id gerado no banco
        codigoFormatado, anoSerieFormatado);
        const disciplinaCriada = await this.disciplinaRepository.criar(disciplina);
        return {
            id: disciplinaCriada.DisciplinaID,
            disciplinaCodigo: disciplinaCriada.disciplinaCodigo,
            nome: obterNomeDisciplina(disciplinaCriada.disciplinaCodigo),
            anoSerie: disciplinaCriada.anoSerie,
            anoSerieNome: obterNomeAnoSerie(disciplinaCriada.anoSerie),
        };
    }
}
