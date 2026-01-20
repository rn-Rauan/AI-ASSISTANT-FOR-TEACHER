/**
 * DTO de resposta para conteúdo gerado
 * @id ID do conteúdo gerado
 * @unidadeID ID da unidade relacionada
 * @tipo Tipo do conteúdo (plano_de_aula | atividade | slide)
 * @conteudo Conteúdo gerado em markdown/texto
 * @criadoEm Data de criação
 */
export interface ConteudoGeradoResponseDTO {
  id: string;
  unidadeID: string;
  tipo: string;
  conteudo: string;
  criadoEm: Date;
}
