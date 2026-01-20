import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";
import { obterNomeDisciplina } from "../../../02-domain/mappings/Disciplina_nome";
import { obterNomeAnoSerie } from "../../../02-domain/mappings/Ano_Serie_nome";
import { OpenAIService } from "../../../03-infrastructure/service/AI.service";

/**
 * UseCase SIMPLIFICADO para sugerir temas
 * 
 * FLUXO:
 * 1. IA sugere 5 temas genéricos de cultura digital
 * 2. Retorna array de strings simples
 * 3. RAG só é usado depois, ao gerar plano/atividade
 */
export class SugerirTemasUseCase {
  constructor(
    private disciplinaRepository: IDisciplinaRepository,
    private iaService: OpenAIService
  ) {}

  async execute(disciplina_id: string): Promise<{ sugestoes: string[] }> {
    const disciplina = await this.disciplinaRepository.findByID(disciplina_id);

    if (!disciplina) {
      throw new Error("Disciplina não encontrada");
    }

    const temas = await this.iaService.sugerirTemasCulturaDigital(
      obterNomeDisciplina(disciplina.disciplinaCodigo),
      obterNomeAnoSerie(disciplina.anoSerie)
    );

    return { sugestoes: temas };
  }
}
