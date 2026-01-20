#  API RAG BNCC - Resumo

> Sistema de Recuperação Aumentada por Geração para consulta semântica à Base Nacional Comum Curricular

##  O que é?

A **API RAG BNCC** é um serviço especializado que utiliza **busca semântica** para consultar a Base Nacional Comum Curricular (BNCC) e extrair automaticamente habilidades, competências e contextos pedagógicos estruturados.

Foi desenvolvida utilizando o **template padrão do LlamaIndex** (`create-llama`) e adaptada para:
-  Indexar o PDF completo da BNCC (600 páginas)
-  Realizar buscas vetoriais semânticas
-  Extrair códigos de habilidades automaticamente (EF/EM)
-  Gerar contextos pedagógicos estruturados com IA
-  Integrar cultura digital aos temas educacionais

---

##  Arquitetura

```
┌─────────────────────────────────────┐
│         API Central (Backend)       │
│                                     │
└──────────────┬──────────────────────┘
               │ HTTP POST
               ▼
┌─────────────────────────────────────┐
│          API RAG BNCC               │
│  ┌──────────────────────────────┐   │
│  │ 1. Recebe: tema + disciplina │   │
│  │ 2. Busca vetorial na BNCC    │   │
│  │ 3. Extrai habilidades (Regex)│   │
│  │ 4. Gera contexto (GPT-4o)    │   │
│  └──────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
               ▼
         ┌─────────────┐
         │ Vector Store│
         │  (BNCC PDF) │
         │    20MB     │
         └─────────────┘
```

###  Tecnologias

| Componente        | Tecnologia                         |
|-------------------|------------------------------------|
| **Framework RAG** | LlamaIndex (template create-llama) |
| **Embeddings**    | OpenAI text-embedding-3-small      |
| **LLM**           | GPT-4o-mini                        |
| **Vector Store**  | JSON local (20MB)                  |
| **Runtime**       | Node.js 18+                        |

---

##  Como Rodar

### 1. Clonar e Instalar

```bash
git clone https://github.com/rn-Rauan/my-app.git
cd my-app
npm install
```

### 2. Configurar `.env`

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
API_PORT=3001
```

### 3. Gerar Índice Vetorial (Primeira Vez)

 **Execute apenas uma vez** - processa todo o PDF da BNCC:

```bash
npm run generate
```

Isso criará o diretório `storage/` com os embeddings vetoriais (~20MB).

### 4. Iniciar API

```bash
npm run api
```

API disponível em: **`http://localhost:3001`**

---

##  Endpoint Principal

### `POST /api/gerar-contexto`

Gera contexto pedagógico estruturado baseado na BNCC.

**Request:**
```json
{
  "tema": "Funções de 1º grau",
  "disciplina": "MATEMÁTICA E SUAS TECNOLOGIAS",
  "serie": "1ª SÉRIE"
}
```

**Response:**
```json
{
  "contexto": {
    "tema": "Funções de 1º grau",
    "serie": "1ª SÉRIE",
    "disciplina": "MATEMÁTICA E SUAS TECNOLOGIAS",
    "habilidadesBNCC": [
      {
        "codigo": "EM13MAT302",
        "descricao": "Construir modelos utilizando funções polinomiais..."
      }
    ],
    "contextoPedagogico": {
      "abordagem": "Introdução conceitual com modelagem matemática",
      "estrategias": [
        "Modelagem de situações reais",
        "Interpretação de gráficos"
      ],
      "metodologias": [
        "Aprendizagem baseada em problemas"
      ]
    },
    "culturaDigital": {
      "relacao": "Uso de ferramentas digitais para visualização",
      "tecnologias": ["GeoGebra", "Desmos", "Excel"],
      "recursos": ["Khan Academy", "Wolfram Alpha"]
    },
    "sugestoesConteudo": [
      "Construção de gráficos",
      "Análise de coeficientes"
    ]
  },
  "bnccReferencia": "Texto completo extraído da BNCC...",
  "fontes": [
    {"pagina": 540, "score": "0.7234"},
    {"pagina": 541, "score": "0.6891"}
  ]
}
```

---

##  Fluxo de Integração

```
1. API Central recebe solicitação do professor
         ↓
2. API Central chama POST /api/gerar-contexto
         ↓
3. API RAG faz busca semântica na BNCC
         ↓
4. API RAG extrai habilidades e gera contexto
         ↓
5. API Central recebe contexto estruturado
         ↓
6. API Central usa contexto no prompt do OpenAI
         ↓
7. OpenAI gera plano de aula/atividade final
```

---

##  Performance

| Métrica                    | Valor                      |
|----------------------------|----------------------------|
| **Tempo de resposta**      | 10-30 segundos             |
| **Queries por tema**       | 3 (estratégia multi-query) |
| **Documentos recuperados** | Top 10 páginas             |
| **Habilidades retornadas** | Até 2 mais relevantes      |
| **Custo por request**      | ~$0.001 USD (OpenAI)       |

---

##  Testar Integração

No **Backend** (API Central), execute:

```bash
npm run test:rag
```

Saída esperada:
```
 Testando integração com API de RAG...
 RAG funcionando!
Contexto retornado: [...]
```

---

##  Diferencial Técnico

### Por que usar RAG?

 **Alinhamento preciso com BNCC**: Busca semântica garante relevância pedagógica  
 **Extração automática de habilidades**: Códigos EF/EM identificados via regex  
 **Contexto estruturado**: Formato JSON padronizado para consumo  
 **Integração com cultura digital**: Sugestões automáticas de tecnologias educacionais  
 **Escalável**: Baseado em LlamaIndex, framework profissional de RAG  

### Adaptações Feitas

A partir do template padrão do LlamaIndex (`create-llama`), adaptamos:

1.  **Indexação do PDF da BNCC** (600 páginas) em embeddings vetoriais
2.  **Estratégia multi-query** para melhor recuperação de contexto
3.  **Extração automática de códigos de habilidades** (EF/EM) via regex
4.  **Prompt especializado** para gerar JSON estruturado com cultura digital
5.  **API REST** pronta para integração com o backend principal

---

##  Documentação Completa

A documentação técnica detalhada está disponível dentro do repositório da API RAG:

**Repositório**: [https://github.com/rn-Rauan/my-app](https://github.com/rn-Rauan/my-app)

 **Conteúdo da documentação completa:**
- Arquitetura detalhada dos componentes
- Estrutura completa de dados (TypeScript interfaces)
- Exemplos de uso com cURL, Node.js e JavaScript
- Guia de troubleshooting e monitoramento
- Códigos de habilidades BNCC (EF/EM)
- Performance, limitações e custos
- Logs e diagnóstico

---

## 🔗 Links Úteis

| Recurso                    | Link                                                                       |
|----------------------------|----------------------------------------------------------------------------|
| **Repositório da API RAG** | [github.com/rn-Rauan/my-app](https://github.com/rn-Rauan/my-app)           |
| **LlamaIndex Docs**        | [docs.llamaindex.ai](https://docs.llamaindex.ai)                           |
| **Template Create-Llama**  | [create-llama](https://www.npmjs.com/package/create-llama)                 |
| **OpenAI Embeddings**      | [platform.openai.com](https://platform.openai.com/docs/guides/embeddings)  |

---

## 💡 Uso no Projeto

No **Backend** (API Central), a integração é feita através do serviço [`RAG_Bncc.service.ts`](../src/03-infrastructure/service/RAG_Bncc.service.ts):

```typescript
// src/03-infrastructure/service/RAG_Bncc.service.ts
export class RagBnccService implements IRagBnccService {
    private apiUrl: string;
    
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl; // http://localhost:3001
    }

    async consultarBNCC(consulta: ConsultarRagDTO): Promise<string> {
        const response = await axios.post(
            `${this.apiUrl}/api/gerar-contexto`,
            {
                tema: consulta.tema,
                disciplina: obterNomeDisciplina(consulta.disciplina_codigo),
                serie: obterNomeAnoSerie(consulta.ano_serie)
            }
        );
        
        // Retorna contexto formatado para uso nos prompts
        return this.formatarContexto(response.data.contexto);
    }
}
```

Veja também:
-  [ADR02 - Arquitetura de APIs Desacopladas](ADR02.md)

---

<div align="center">

**Desenvolvido com LlamaIndex + OpenAI para o Hackathon IFPI 2026**

</div>
