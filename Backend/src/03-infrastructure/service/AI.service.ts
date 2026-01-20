import OpenAI from "openai";
import { IAIService } from "../../02-domain/interfaces/IAIService";

/**
 * Serviço simples de IA usando OpenAI
 * 
 * FLUXO:
 * 1. sugerirTemas() - IA gera 5 temas de cultura digital
 * 2. gerarPlanoDeAula() - RAG valida + IA gera plano
 * 3. gerarAtividade() - RAG valida + IA gera atividade
 */
export class OpenAIService implements IAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Sugere temas de cultura digital (sem validar BNCC ainda)
   */
  async sugerirTemasCulturaDigital(
    disciplina: string,
    anoSerie: string
  ): Promise<string[]> {
    const prompt = `Sugira EXATAMENTE 5 temas relacionados com cultura digital para:
- Disciplina: ${disciplina}
- Ano/Série: ${anoSerie}

Os temas devem:
- Ser apropriados para a faixa etária
- Integrar tecnologia e cultura digital
- Estar alinhados ao currículo brasileiro (BNCC)
- Ter no maximo 80 caracteres.

Retorne APENAS um array JSON de strings (sem explicações):
["Tema 1", "Tema 2", "Tema 3", "Tema 4", "Tema 5"]`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Retorne apenas JSON válido, sem markdown ou texto extra.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      const text = response.choices[0].message.content || "[]";
      const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      return JSON.parse(jsonText);
    } catch (error: any) {
      console.error("Erro ao sugerir temas:", error);
      throw new Error("Erro ao gerar sugestões de temas: " + error.message);
    }
  }

  /**
   * Gera plano de aula com base no contexto do RAG
   */
  async gerarPlanoDeAula(
    tema: string,
    contextoBNCC: string,
    disciplina: string,
    anoSerie: string
  ): Promise<string> {
    const prompt = `Crie um PLANO DE AULA completo e detalhado.

TEMA: ${tema}
DISCIPLINA: ${disciplina}
ANO/SÉRIE: ${anoSerie}

CONTEXTO BNCC (validado pelo RAG):
${contextoBNCC}

Estrutura do plano:

# PLANO DE AULA: ${tema}

## 1. IDENTIFICAÇÃO
- Disciplina, ano/série, duração, tema

## 2. OBJETIVOS DE APRENDIZAGEM
- 3-5 objetivos específicos alinhados à BNCC

## 3. HABILIDADES BNCC
- Habilidades do contexto acima

## 4. RECURSOS NECESSÁRIOS
### Digitais: apps, sites, plataformas
### Tradicionais: materiais físicos

## 5. DESENVOLVIMENTO
### Momento 1: Introdução (10-15 min)
### Momento 2: Desenvolvimento (25-30 min)
### Momento 3: Consolidação (10-15 min)

## 6. INTEGRAÇÃO COM CULTURA DIGITAL
Como a tecnologia é usada pedagogicamente

## 7. AVALIAÇÃO
Como avaliar o aprendizado

## 8. ADAPTAÇÕES
Sugestões para diferentes níveis

Seja DETALHADO e PRÁTICO.`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um professor experiente especializado em BNCC e cultura digital." },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 3000,
      });

      return response.choices[0].message.content || "Erro ao gerar plano";
    } catch (error: any) {
      console.error("Erro ao gerar plano:", error);
      throw new Error("Erro ao gerar plano de aula: " + error.message);
    }
  }

  /**
   * Gera atividade avaliativa com base no contexto do RAG
   */
  async gerarAtividade(
    tema: string,
    contextoBNCC: string,
    disciplina: string,
    anoSerie: string
  ): Promise<string> {
    const prompt = `Crie uma ATIVIDADE AVALIATIVA completa.

TEMA: ${tema}
DISCIPLINA: ${disciplina}
ANO/SÉRIE: ${anoSerie}

CONTEXTO BNCC (validado pelo RAG):
${contextoBNCC}

Estrutura:

# ATIVIDADE AVALIATIVA: ${tema}

## INFORMAÇÕES
Disciplina, ano, tema, duração, tipo

## COMPETÊNCIAS E HABILIDADES
Habilidades BNCC do contexto

## INSTRUÇÕES PARA O ALUNO

## QUESTÕES

### PARTE 1: Conhecimento Básico (30 pontos)
3-4 questões objetivas/dissertativas curtas

### PARTE 2: Aplicação (40 pontos)
2-3 questões práticas
1 atividade com recurso digital

### PARTE 3: Cultura Digital (30 pontos)
1 atividade prática com tecnologia

## CRITÉRIOS DE AVALIAÇÃO
Rubrica com pontuação

## RECURSOS NECESSÁRIOS

## GABARITO/ORIENTAÇÕES

## ALTERNATIVAS PARA ALUNOS SEM TECNOLOGIA

Seja CLARO e JUSTO.`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um professor experiente especializado em avaliação e BNCC." },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 3000,
      });

      return response.choices[0].message.content || "Erro ao gerar atividade";
    } catch (error: any) {
      console.error("Erro ao gerar atividade:", error);
      throw new Error("Erro ao gerar atividade: " + error.message);
    }
  }
}
