# Integração com a API RAG BNCC

## Visão Geral

A **API RAG BNCC** é um serviço de enriquecimento de contexto projetado para consultar a Base Nacional Comum Curricular (BNCC). Seu objetivo é fornecer um embasamento pedagógico estruturado que servirá como um insumo de alta qualidade para a geração de conteúdo educacional por modelos de linguagem, como o GPT-4.

Para sua construção, foi utilizado o template RAG do **LlamaIndex**, que foi adaptado para indexar e realizar buscas semânticas no documento da BNCC. O resultado é uma API que serve como ponte entre o conteúdo pedagógico oficial e os modelos de IA generativa.

Em vez de fazer uma consulta genérica, a API RAG BNCC realiza uma busca semântica direcionada no documento da BNCC, extraindo habilidades, competências, e sugestões de conteúdo relevantes para um determinado tema, disciplina e série.

**Repositório da API:** `https://github.com/rn-Rauan/my-app.git`

---

## Fluxo de Uso

O fluxo de integração consiste em duas etapas principais:

1.  **Chamada à API RAG BNCC**: A API central primeiro chama o endpoint `POST /api/gerar-contexto` para obter o contexto pedagógico estruturado.
2.  **Chamada ao Modelo de Geração (OpenAI)**: Em seguida, a API central utiliza o objeto `contexto` retornado pela API RAG BNCC para montar um prompt muito mais rico e detalhado para o modelo da OpenAI, resultando em um plano de aula mais preciso e alinhado à BNCC.

---

## API Reference

### Endpoint: `POST /api/gerar-contexto`

Este é o endpoint principal que retorna o contexto pedagógico.

-   **URL**: `http://localhost:3001/api/gerar-contexto` 
-   **Método**: `POST`
-   **Headers**:
    -   `Content-Type: application/json`

#### Corpo da Requisição (Body)

| Parâmetro    | Tipo   | Obrigatório | Descrição                               | Exemplo                                |
|--------------|--------|-------------|-----------------------------------------|----------------------------------------|
| `tema`       | string | Sim         | O tema central da aula ou conteúdo.     | `"Funções de 1º grau"`                 |
| `disciplina` | string | Sim         | A disciplina conforme a BNCC.           | `"MATEMÁTICA E SUAS TECNOLOGIAS"`      |
| `serie`      | string | Sim         | O ano ou série do ensino.               | `"1ª SÉRIE"`                           |

#### Exemplo de Requisição

```json
{
  "tema": "Funções polinomiais de 1º ou 2º graus",
  "disciplina": "MATEMÁTICA E SUAS TECNOLOGIAS",
  "serie": "2ª SÉRIE"
}
```

---

## Utilizando a Resposta no Prompt Final

A parte mais importante da resposta da API RAG BNCC é o objeto `contexto`. Este objeto deve ser serializado (como uma string JSON ou um formato legível) e inserido diretamente no prompt que você enviará para a OpenAI.

#### Exemplo do objeto `contexto` retornado:

```json
{
  "contexto": {
    "tema": "Funções polinomiais de 1º ou 2º graus",
    "serie": "2ª SÉRIE",
    "disciplina": "MATEMÁTICA E SUAS TECNOLOGIAS",
    "habilidadesBNCC": [
      {
        "codigo": "EM13MAT302",
        "descricao": "Construir modelos utilizando funções polinomiais de 1º ou 2º graus para resolver problemas em contextos diversos."
      }
    ],
    "contextoPedagogico": {
      "abordagem": "Introdução conceitual com construção de modelos matemáticos.",
      "estrategias": ["Modelagem de situações reais", "Interpretação de gráficos"],
      "metodologias": ["Aprendizagem baseada em problemas"]
    },
    "culturaDigital": {
      "relacao": "Uso de ferramentas digitais para visualização de gráficos de funções.",
      "tecnologias": ["GeoGebra", "Desmos", "Excel/Google Sheets"],
      "competenciasDigitais": ["Uso de software matemático", "Análise de dados digitais"]
    },
    "sugestoesConteudo": ["Construção de gráficos", "Análise de coeficientes", "Problemas do cotidiano"]
  }
}
```

#### Exemplo de como montar o prompt para a OpenAI:

Com o `contexto` acima, você pode construir um prompt muito mais eficaz:

> **Prompt para a OpenAI:**
>
> "Você é um especialista em pedagogia. Crie um plano de aula detalhado para o Ensino Médio.
>
> **Tema:** Funções polinomiais de 1º ou 2º graus
> **Série:** 2ª SÉRIE
>
> Utilize o seguinte contexto pedagógico extraído da BNCC como base para o plano de aula:
> ```json
> {
>   "habilidadesBNCC": [
>     {
>       "codigo": "EM13MAT302",
>       "descricao": "Construir modelos utilizando funções polinomiais de 1º ou 2º graus para resolver problemas em contextos diversos."
>     }
>   ],
>   "contextoPedagogico": {
>     "abordagem": "Introdução conceitual com construção de modelos matemáticos.",
>     "estrategias": ["Modelagem de situações reais", "Interpretação de gráficos"],
>     "metodologias": ["Aprendizagem baseada em problemas"]
>   },
>   "culturaDigital": {
>     "relacao": "Uso de ferramentas digitais para visualização de gráficos de funções.",
>     "tecnologias": ["GeoGebra", "Desmos", "Excel/Google Sheets"]
>   },
>   "sugestoesConteudo": ["Construção de gráficos", "Análise de coeficientes", "Problemas do cotidiano"]
> }
> ```
>
> O plano de aula deve incluir:
> 1.  Objetivos de aprendizagem claros.
> 2.  Uma metodologia passo a passo.
> 3.  Atividades práticas que integrem as tecnologias sugeridas.
> 4.  Formas de avaliação."

Este método garante que o resultado final seja altamente relevante, específico e alinhado com as diretrizes educacionais.