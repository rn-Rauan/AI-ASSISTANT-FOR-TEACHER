import { ConteudoGerado } from "../entities/ConteudoGerado";

/**
 * Interface do repositório de ConteudoGerado
 */
export interface IConteudoGeradoRepository {
    criar(conteudoGerado: ConteudoGerado): Promise<ConteudoGerado>;
    buscarPorID(id: string): Promise<ConteudoGerado | null>;
    listarPorUnidade(unidade_id: string): Promise<ConteudoGerado[]>;
    listarPorTipo(unidade_id: string, tipo: string): Promise<ConteudoGerado[]>;
}
