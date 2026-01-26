import { ConteudoGerado } from "../../../02-domain/entities/ConteudoGerado";
import { IAIService } from "../../../02-domain/interfaces/IAIService";
import { IConteudoGeradoRepository } from "../../../02-domain/interfaces/IConteudoGeradoRepository";
import { IUnidadeRepository } from "../../../02-domain/interfaces/IUnidadeRepository";
import { ConteudoGeradoResponseDTO } from "../../dtos/ConteudoDTOs/ConteudoGeradoResponseDTO";

/**
 * UseCase para refinar conteúdos gerados
 */
export class RefinarConteudoUseCase {
    /**
     * 
     * @param conteudoRepository Repositório para operações de persistência de conteúdo gerado
     * @param unidadeRepository Repositório para operações de persistência de unidade
     * @param AIservice Serviço de IA para refinar conteúdo
     */
    constructor(private conteudoRepository: IConteudoGeradoRepository, private unidadeRepository: IUnidadeRepository, private AIservice: IAIService) { }

    async execute(unidadeID: string, conteudosIDs: string[], instrucao: string): Promise<ConteudoGeradoResponseDTO[]> {
        if (!unidadeID || unidadeID.trim().length == 0) {
            throw new Error("ID da unidade é obrigatório");
        }
        if (conteudosIDs.length == 0) {
            throw new Error("Não ha conteúdos para refinar");
        }
        if (!instrucao || instrucao.trim().length < 2) {
            throw new Error("Instrução inválida");
        }
        const unidade = await this.unidadeRepository.findByID(unidadeID);
        if (!unidade) {
            throw new Error("Unidade não encontrada");
        }

        const promisasDeRefinamento = conteudosIDs.map(async (conteudoID) => {
            // Buscar o conteúdo no banco de dados - assim temos a instância correta da classe
            const conteudoExistente = await this.conteudoRepository.buscarPorID(conteudoID);
            if (!conteudoExistente) {
                throw new Error(`Conteúdo com ID ${conteudoID} não encontrado`);
            }

            let conteudoRefinadoTexto : string;
            switch (conteudoExistente.Tipo) {
                case "plano_de_aula":
                    conteudoRefinadoTexto = await this.AIservice.refinarPlanoDeAula(conteudoExistente.Conteudo, instrucao);
                    break;
                case "atividade":
                    conteudoRefinadoTexto = await this.AIservice.refinarAtividade(conteudoExistente.Conteudo, instrucao);
                    break;
                case "slide":
                    conteudoRefinadoTexto = await this.AIservice.refinarSlide(conteudoExistente.Conteudo, instrucao);
                    break;
                default:
                    throw new Error(`Tipo ${conteudoExistente.Tipo} não implementado`);
            }

            conteudoExistente.Conteudo = conteudoRefinadoTexto;
            const conteudoAtualizado = await this.conteudoRepository.update(conteudoExistente);
            return {
                id: conteudoAtualizado.ConteudoID,
                unidadeID: conteudoAtualizado.UnidadeID,
                tipo: conteudoAtualizado.Tipo,
                conteudo: conteudoAtualizado.Conteudo,
                criadoEm: conteudoAtualizado.CriadoEm,
            };
        });

        const conteudosRefinados = await Promise.all(promisasDeRefinamento);
        return conteudosRefinados.filter(conteudo => conteudo != null) as ConteudoGeradoResponseDTO[];
    }
}