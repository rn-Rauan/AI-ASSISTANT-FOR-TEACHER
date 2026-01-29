import { IAIService } from "../../../02-domain/interfaces/IAIService";
import { IConteudoGeradoRepository } from "../../../02-domain/interfaces/IConteudoGeradoRepository";
import {
  ConteudoRefinadoResponseDTO,
  ResponseRefinamento,
} from "../../dtos/ConteudoDTOs/ConteudoRefinadoResponseDTO";

/**
 * UseCase para refinar conteúdos gerados sem persistir (Preview)
 */
export class RefinarConteudoPreviewUseCase {
    /**
     * 
     * @param conteudoRepository Repositório para operações de busca de conteúdo gerado
     * @param AIservice Serviço de IA para refinar conteúdo
     */
    constructor(private conteudoRepository: IConteudoGeradoRepository, private AIservice: IAIService) { }

    async execute(conteudoID: string, instrucao: string): Promise<ConteudoRefinadoResponseDTO> {
        if (!conteudoID || conteudoID.trim().length == 0) {
            throw new Error("ID do conteúdo é obrigatório");
        }
        if (!instrucao || instrucao.trim().length < 2) {
            throw new Error("Instrução inválida");
        }

        // Buscar o conteúdo no banco de dados
        const conteudoExistente = await this.conteudoRepository.buscarPorID(conteudoID);
        if (!conteudoExistente) {
            throw new Error(`Conteúdo com ID ${conteudoID} não encontrado`);
        }

        let respostaRefinamento : ResponseRefinamento;
        switch (conteudoExistente.Tipo) {
            case "plano_de_aula":
                respostaRefinamento = await this.AIservice.refinarPlanoDeAula(conteudoExistente.Conteudo, instrucao);
                break;
            case "atividade":
                respostaRefinamento = await this.AIservice.refinarAtividade(conteudoExistente.Conteudo, instrucao);
                break;
            case "slide":
                respostaRefinamento = await this.AIservice.refinarSlide(conteudoExistente.Conteudo, instrucao);
                break;
            default:
                throw new Error(`Tipo ${conteudoExistente.Tipo} não implementado`);
        }
        
        // Retornar a prévia sem salvar
        return {
            id: conteudoExistente.ConteudoID,
            unidadeID: conteudoExistente.UnidadeID,
            tipo: conteudoExistente.Tipo,
            conteudo: respostaRefinamento.conteudo, // Conteúdo refinado
            criadoEm: conteudoExistente.CriadoEm,
            mensagemIA: respostaRefinamento.mensagemIA,
        };
    }
}
