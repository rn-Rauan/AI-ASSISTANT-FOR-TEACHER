import OpenAI from "openai";
import { ConteudoEstruturado, IAIService } from "../../02-domain/interfaces/IAIService";
import { Content } from "openai/resources/containers/files/content";

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
    anoSerie: string,
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
      const jsonText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

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
    anoSerie: string,
  ): Promise<ConteudoEstruturado> {
    const prompt = `Você deve retornar um objeto JSON com EXATAMENTE duas propriedades: "planoDeAula" e "conteudoSlides".

TEMA: ${tema}
DISCIPLINA: ${disciplina}
ANO/SÉRIE: ${anoSerie}

CONTEXTO BNCC (validado pelo RAG):
${contextoBNCC}

IMPORTANTE: Retorne um JSON válido neste formato:
{
  "planoDeAula": "texto markdown completo do plano de aula",
  "conteudoSlides": "texto markdown completo para os slides"
}

Para o campo "planoDeAula", crie um plano completo em Markdown seguindo esta estrutura:

# PLANO DE AULA: ${tema}

## 1. IDENTIFICAÇÃO
- Disciplina, ano/série, duração, tema

## 2. OBJETIVOS DE APRENDIZAGEM
- 3-5 objetivos específicos alinhados à BNCC

## 3. HABILIDADES BNCC
- Habilidades do contexto BNCC acima com seus respectivos códigos


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

Para o campo "conteudoSlides", crie slides FOCADOS NO ALUNO em Markdown:
- Use '#' para iniciar cada novo slide
- Crie 5-8 slides
- Linguagem SIMPLES e DIRETA para estudantes
- CONTEÚDO, não estrutura de aula
- Foque no CONHECIMENTO que o aluno vai aprender
- Use listas com '-' para informações importantes
- Inclua exemplos práticos e curiosidades quando possível

NÃO inclua nos slides: objetivos, habilidades BNCC, recursos, avaliação (isso é para o professor)
INCLUA nos slides: conceitos, explicações, exemplos, fatos importantes, curiosidades, aplicações práticas

Exemplo de estrutura de slides PARA O ALUNO:
# ${tema}
Breve contexto histórico ou introdução

# O que foi?
- Definição simples
- Quando aconteceu
- Principais envolvidos

# Por que aconteceu?
- Causas principais
- Contexto da época

# Como foi?
- Eventos importantes
- Fases ou etapas

# Consequências
- O que mudou
- Impactos na época

# Curiosidades
- Fatos interessantes
- Exemplos práticos

# Conexão com Hoje
- Como isso afeta nosso mundo atual
- Exemplos contemporâneos

RETORNE APENAS O JSON, sem markdown wrappers.`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é um professor experiente especializado em BNCC e cultura digital. Retorne APENAS um objeto JSON válido com as propriedades 'planoDeAula' e 'conteudoSlides', ambas contendo texto em formato Markdown.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 4096,
      });

      const text = response.choices[0].message.content;

      if (!text) {
        throw new Error("Resposta vazia da IA");
      }

      const resultado = JSON.parse(text);
      
      // Validar que os campos existem e são strings
      if (!resultado.planoDeAula || !resultado.conteudoSlides) {
        throw new Error("Resposta da IA está incompleta");
      }

      return resultado as ConteudoEstruturado;
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
    anoSerie: string,
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
          {
            role: "system",
            content:
              "Você é um professor experiente especializado em avaliação e BNCC.",
          },
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
  async refinarPlanoDeAula(planoDeAula: string, instrucoes: string): Promise<string> {
    if (!instrucoes || instrucoes.trim() == "") {
      return Promise.resolve(planoDeAula);
    }
    const prompt = `Você é um assistente pedagógico especialista em currículo brasileiro (BNCC) e em refinar planos de aula.
    Sua tarefa é ajustar o PLANO DE AULA fornecido, seguindo rigorosamente a instrução do professor e uma regra crítica.

    **REGRA CRÍTICA E INEGOCIÁVEL:**
    - **NÃO ALTERE, NÃO ADICIONE e NÃO REMOVA as HABILIDADES DA BNCC** listadas no plano de aula original. Elas são o alicerce do plano e devem ser mantidas exatamente como estão. Sua tarefa é adaptar o restante do plano em torno delas.
    **INSTRUÇÃO DO PROFESSOR:**
    "${instrucoes}"
    **PLANO DE AULA ATUAL:**
    ${planoDeAula}
    **SUA TAREFA:**
    1.  Leia a "INSTRUÇÃO DO PROFESSOR".
    2.  Analise o "PLANO DE AULA ATUAL".
    3.  Reescreva o plano de aula completo, aplicando a instrução do professor.
    4.  Concentre as modificações nas seções de **Desenvolvimento (Momentos 1, 2, 3)**, **Recursos**, **Avaliação** e **Adaptações**, garantindo que elas se alinhem à instrução.
    5.  **GARANTA** que a seção "HABILIDADES BNCC" do plano de aula refinado seja **IDÊNTICA** à do plano original.
    6.  Mantenha o formato e a estrutura do documento.
    Retorne APENAS o plano de aula completo e refinado, sem adicionar comentários, introduções ou qualquer texto fora do plano.`;
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um assistente pedagógico especialista em currículo brasileiro (BNCC) e em refinar planos de aula."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 4096
      })
      return response.choices[0].message.content || "Erro ao refinar plano";

    } catch (error: any) {
      throw new Error("Erro ao refinar plano de aula: " + error.message);
    }
  }
  
  async refinarAtividade(atividade: string, instrucoes: string): Promise<string> {
    if (!instrucoes || instrucoes.trim() == "") {
      return Promise.resolve(atividade);
    }
    
    const prompt = `Você é um assistente pedagógico especialista em refinar atividades avaliativas.
    
    **INSTRUÇÃO DO PROFESSOR:**
    "${instrucoes}"
    
    **ATIVIDADE ATUAL:**
    ${atividade}
    
    **SUA TAREFA:**
    1. Leia a instrução do professor
    2. Analise a atividade atual
    3. Reescreva a atividade completa aplicando as melhorias solicitadas
    4. Mantenha a estrutura e formatação do documento
    5. Preserve as competências e habilidades BNCC originais
    
    Retorne APENAS a atividade refinada, sem comentários adicionais.`;
    
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um assistente pedagógico especialista em criar e refinar atividades avaliativas."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 3000
      });
      
      return response.choices[0].message.content || "Erro ao refinar atividade";
    } catch (error: any) {
      throw new Error("Erro ao refinar atividade: " + error.message);
    }
  }
  
  async refinarSlide(slideMarkdown: string, instrucoes: string): Promise<string> {
    if (!instrucoes || instrucoes.trim() == "") {
      return Promise.resolve(slideMarkdown);
    }
    
    const prompt = `Você é um designer educacional especialista em criar apresentações didáticas.
    
    **INSTRUÇÃO DO PROFESSOR:**
    "${instrucoes}"
    
    **CONTEÚDO DE SLIDES ATUAL (Markdown):**
    ${slideMarkdown}
    
    **SUA TAREFA:**
    1. Leia a instrução do professor
    2. Analise o conteúdo dos slides em Markdown
    3. Ajuste o conteúdo aplicando as melhorias solicitadas
    4. Mantenha o formato Markdown (# para títulos, - para listas)
    5. Seja conciso e visual - slides devem ser objetivos
    6. Use '#' para cada novo slide
    
    Retorne APENAS o conteúdo refinado em Markdown, sem comentários.`;
    
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um designer educacional especialista em apresentações didáticas."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 2000
      });
      
      return response.choices[0].message.content || "Erro ao refinar slides";
    } catch (error: any) {
      throw new Error("Erro ao refinar slides: " + error.message);
    }
  }
}