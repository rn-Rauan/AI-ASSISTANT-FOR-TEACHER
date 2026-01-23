# Documentação da API - AI Assistant for Teacher

## Base URL
```
http://localhost:<PORT>
```

---

##  Disciplinas

### 1. Listar Todas as Disciplinas
**GET** `/disciplinas`

Lista todas as disciplinas cadastradas no sistema.

**Parâmetros:** Nenhum

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid",
    "disciplinaCodigo": "LP",
    "nome": "Língua Portuguesa",
    "anoSerie": "6_ANO",
    "anoSerieNome": "6º Ano"
  }
]
```

**Erros:**
- `500`: Erro interno do servidor

---

### 2. Obter Disciplina por ID
**GET** `/disciplinas/:id`

Retorna os dados de uma disciplina específica.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID da disciplina

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid",
  "disciplinaCodigo": "LP",
  "nome": "Língua Portuguesa",
  "anoSerie": "6_ANO",
  "anoSerieNome": "6º Ano"
}
```

**Erros:**
- `400`: ID da disciplina não foi fornecido
- `500`: Erro interno do servidor

---

### 3. Criar Disciplina
**POST** `/disciplinas`

Cria uma nova disciplina no sistema.

**Body (JSON):**
```json
{
  "disciplina_codigo": "LP",
  "ano_serie": "6_ANO"
}
```

**Campos:**
- `disciplina_codigo` (string, obrigatório): Código da disciplina
  - Valores válidos: `"LP"`, `"MA"`, `"CI"`, `"HI"`, `"GE"`, `"AR"`, `"EF"`, `"IN"`, `"LPP"`, `"MAT"`, `"CHS"`, `"CNT"`
- `ano_serie` (string, obrigatório): Ano ou série
  - Valores válidos: `"6_ANO"`, `"7_ANO"`, `"8_ANO"`, `"9_ANO"`, `"1_SERIE"`, `"2_SERIE"`, `"3_SERIE"`

**Resposta de Sucesso (201):**
```json
{
  "id": "uuid",
  "disciplinaCodigo": "LP",
  "nome": "Língua Portuguesa",
  "anoSerie": "6_ANO",
  "anoSerieNome": "6º Ano"
}
```

**Erros:**
- `400`: Campos obrigatórios não fornecidos
- `500`: Erro interno do servidor

---

### 4. Deletar Disciplina
**DELETE** `/disciplinas/:id`

Remove uma disciplina do sistema.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID da disciplina

**Resposta de Sucesso (200):**
```json
{
  "message": "Disciplina deletada com sucesso"
}
```

**Erros:**
- `400`: ID da disciplina não foi fornecido
- `500`: Erro interno do servidor

---

##  Temas

### 5. Sugerir Temas para Disciplina
**GET** `/disciplinas/:id/sugerir-temas`

Gera sugestões de temas baseados na disciplina, utilizando IA e a BNCC.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID da disciplina

**Resposta de Sucesso (200):**
```json
{
  "temas": [
    "Tema sugerido 1",
    "Tema sugerido 2",
    "Tema sugerido 3"
  ]
}
```

**Erros:**
- `400`: ID da disciplina não foi fornecido
- `500`: Erro ao processar sugestões de temas

---

##  Gerar Conteúdo

### 6. Gerar Conteúdos (Cria Unidade + Conteúdos)
**POST** `/gerar/conteudos`

**ROTA PRINCIPAL** - Cria uma nova unidade e gera os conteúdos (plano de aula, atividade, slides) em uma única operação. **Otimizado para fazer apenas UMA chamada ao RAG**, economizando tempo e recursos.

**Body (JSON):**
```json
{
  "disciplina_id": "uuid",
  "tema": "Gêneros Textuais",
  "observacoes": "Focar em textos narrativos",
  "tipos": ["plano_de_aula", "atividade"]
}
```

**Campos:**
- `disciplina_id` (string, obrigatório): ID da disciplina relacionada
- `tema` (string, obrigatório): Tema da unidade a ser criada
- `observacoes` (string, opcional): Observações adicionais para guiar a geração de conteúdo
- `tipos` (array, obrigatório): Lista com os tipos de conteúdo desejados
  - Valores válidos: `"plano_de_aula"`, `"atividade"`, `"slide"`

**Resposta de Sucesso (201):**
```json
{
  "unidade": {
    "id": "uuid",
    "disciplinaID": "uuid",
    "tema": "Gêneros Textuais",
    "criadoEm": "2026-01-20T00:00:00.000Z"
  },
  "conteudos": [
    {
      "id": "uuid1",
      "unidadeID": "uuid",
      "tipo": "plano_de_aula",
      "conteudo": "# PLANO DE AULA: Gêneros Textuais\n...",
      "criadoEm": "2026-01-20T00:00:00.000Z"
    },
    {
      "id": "uuid2",
      "unidadeID": "uuid",
      "tipo": "atividade",
      "conteudo": "# ATIVIDADE AVALIATIVA: Gêneros Textuais\n...",
      "criadoEm": "2026-01-20T00:00:00.000Z"
    }
  ]
}
```

**Vantagens:**
-  **Criação atômica** - Unidade e conteúdos criados juntos (sem estados inconsistentes)
-  **Uma única consulta ao RAG** - Mais rápido e eficiente
-  **Reduz custos** - Menos chamadas de API
-  **Contexto consistente** - Todos os conteúdos usam o mesmo contexto BNCC
-  **Geração paralela** - Múltiplos conteúdos gerados simultaneamente

**Erros:**
- `400`: Campos obrigatórios não fornecidos ou tipos inválidos
- `404`: Disciplina não encontrada
- `500`: Erro ao gerar conteúdos

---

### 7. Listar Conteúdos de uma Unidade
**GET** `/conteudos/:id`

Lista todos os conteúdos gerados para uma unidade específica (planos de aula, atividades, slides).

**Parâmetros de URL:**
- `id` (string, obrigatório): ID da unidade

**Exemplo:**
```
GET /conteudos/123e4567-e89b-12d3-a456-426614174000
```

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid1",
    "unidadeID": "uuid",
    "tipo": "plano_de_aula",
    "conteudo": "# PLANO DE AULA: Gêneros Textuais\n...",
    "criadoEm": "2026-01-20T00:00:00.000Z"
  },
  {
    "id": "uuid2",
    "unidadeID": "uuid",
    "tipo": "atividade",
    "conteudo": "# ATIVIDADE AVALIATIVA: Gêneros Textuais\n...",
    "criadoEm": "2026-01-20T00:00:00.000Z"
  }
]
```

**Detalhes dos Tipos de Conteúdo:**

**Plano de Aula** (`plano_de_aula`):
- Identificação (disciplina, ano/série, duração, tema)
- Objetivos de aprendizagem (3-5 objetivos alinhados à BNCC)
- Habilidades BNCC
- Recursos necessários (digitais e tradicionais)
- Desenvolvimento (momentos da aula)
- Integração com cultura digital
- Avaliação
- Adaptações para diferentes níveis

**Atividade** (`atividade`):
- Informações (disciplina, ano, tema, duração, tipo)
- Competências e habilidades BNCC
- Instruções para o aluno
- Questões divididas em partes (conhecimento básico, aplicação, cultura digital)
- Critérios de avaliação (rubrica com pontuação)
- Recursos necessários
- Gabarito/Orientações
- Alternativas para alunos sem tecnologia

**Erros:**
- `400`: Campo id não foi fornecido
- `500`: Erro interno do servidor

---

### 8. Atualizar Conteúdo
**PUT** `/conteudos/:id`

Atualiza o conteúdo de um conteúdo gerado específico.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID do conteúdo

**Body (JSON):**
```json
{
  "conteudo": "# PLANO DE AULA ATUALIZADO: Gêneros Textuais\n..."
}
```

**Campos:**
- `conteudo` (string, obrigatório): Novo conteúdo em formato Markdown

**Resposta de Sucesso (200):**
```json
{
  "message": "Conteúdo atualizado com sucesso",
  "conteudoAtualizado": {
    "id": "uuid",
    "unidadeID": "uuid",
    "tipo": "plano_de_aula",
    "conteudo": "# PLANO DE AULA ATUALIZADO: Gêneros Textuais\n...",
    "criadoEm": "2026-01-20T00:00:00.000Z"
  }
}
```

**Erros:**
- `400`: Campos obrigatórios não fornecidos (id e conteudo)
- `404`: Conteúdo não encontrado
- `500`: Erro interno do servidor

---

##  Unidades

### 9. Listar Unidades
**GET** `/unidades?disciplina_id={id}`

Lista todas as unidades de uma disciplina específica.

**Parâmetros de Query:**
- `disciplina_id` (string, obrigatório): ID da disciplina

**Exemplo:**
```
GET /unidades?disciplina_id=123e4567-e89b-12d3-a456-426614174000
```

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid",
    "disciplinaID": "uuid",
    "tema": "Gêneros Textuais",
    "criadoEm": "2026-01-19T00:00:00.000Z"
  }
]
```

**Erros:**
- `400`: Campo disciplina_id não foi fornecido
- `500`: Erro interno do servidor

---

### 10. Obter Unidade por ID
**GET** `/unidades/:id`

Retorna os dados de uma unidade específica.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID da unidade

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid",
  "disciplinaID": "uuid",
  "t8ma": "Gêneros Textuais",
  "criadoEm": "2026-01-19T00:00:00.000Z"
}
```

**Erros:**
- `400`: ID da unidade não foi fornecido
- `404`: Unidade não encontrada
- `500`: Erro interno do servidor

---

### 11. Deletar Unidade
**DELETE** `/unidades/:id`

Remove uma unidade do sistema.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID da unidade

**Resposta de Sucesso (200):**
```json
{
  "message": "Unidade excluída com sucesso."
}
```

**Erros:**
- `400`: ID da unidade não foi fornecido
- `404`: Unidade não encontrada
- `500`: Erro interno do servidor

---

##  Códigos de Status HTTP

### Sucessos (2xx)
- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso

### Erros do Cliente (4xx)
- `400 Bad Request`: Dados inválidos ou campos obrigatórios ausentes
- `404 Not Found`: Recurso não encontrado
- `405 Method Not Allowed`: Método HTTP não permitido
- `408 Request Timeout`: Timeout do cliente
- `409 Conflict`: Conflito de regra de negócio
- `422 Unprocessable Entity`: Erro de semântica nos dados
- `429 Too Many Requests`: Limite de requisições excedido

### Erros do Servidor (5xx)
- `500 Internal Server Error`: Erro interno inesperado
- `502 Bad Gateway`: Resposta inválida do banco ou API externa
- `503 Service Unavailable`: Servidor em manutenção ou sobrecarregado
- `504 Gateway Timeout`: Timeout do banco ou API externa

---

##  Tipos e Enumerações

### Códigos de Disciplina
```typescript
type disciplina_codigo = 
  | "LP"   // Língua Portuguesa
  | "MA"   // Matemática
  | "CI"   // Ciências
  | "HI"   // História
  | "GE"   // Geografia
  | "AR"   // Arte
  | "EF"   // Educação Física
  | "IN"   // Inglês
  | "LPP"  // Língua Portuguesa e Literatura
  | "MAT"  // Matemática
  | "CHS"  // Ciências Humanas e Sociais
  | "CNT"  // Ciências da Natureza e Tecnologia
```

### Ano/Série
```typescript
type ano_serie = 
  | "6_ANO"    // 6º Ano (Ensino Fundamental II)
  | "7_ANO"    // 7º Ano (Ensino Fundamental II)
  | "8_ANO"    // 8º Ano (Ensino Fundamental II)
  | "9_ANO"    // 9º Ano (Ensino Fundamental II)
  | "1_SERIE"  // 1ª Série (Ensino Médio)
  | "2_SERIE"  // 2ª Série (Ensino Médio)
  | "3_SERIE"  // 3ª Série (Ensino Médio)
```

---

##  Fluxo de Uso Recomendado

1. **Criar uma Disciplina**
   ```
   POST /disciplinas
   ```

2. **Obter Sugestões de Temas (Opcional)**
   ```
   GET /disciplinas/{id}/sugerir-temas
   ```

3. **Criar Unidades para a Disciplina**
   ```
   POST /unidades
   ```

4. **Gerar Conteúdos para as Unidades**
   ```
   POST /gerar/conteudos
   ```

5. **Listar Unidades da Disciplina**
   ```
   GET /unidades?disciplina_id={id}
   ```

6. **Gerenciar Recursos Específicos**
   - Consultar: `GET /disciplinas/{id}` ou `GET /unidades/{id}`
   - Deletar: `DELETE /disciplinas/{id}` ou `DELETE /unidades/{id}`

---

   Exemplo: Língua Portuguesa para 6º Ano

2. **Obter Sugestões de Temas**
   ```
   GET /disciplinas/{id}/sugerir-temas
   ```
   A IA sugere temas relevantes baseados na BNCC e podem ser usados ao criar uma unidade.

3. **Gerar Conteúdos (Cria Unidade + Conteúdos)**
   ```
   POST /gerar/conteudos
   ```
   - Cria a unidade automaticamente
   - Gera os conteúdos selecionados (plano de aula, atividade, slides)
   - Retorna tudo de uma vez

4. **Visualizar Histórico de Unidades**
   ```
   GET /unidades?disciplina_id={id}
   ```
   Lista todas as unidades criadas para a disciplina

5. **Visualizar Conteúdos de uma Unidade**
   ```
   GET /conteudos/:id
   ```
   Lista todos os conteúdos (plano, atividade, slides) da unidade (onde :id é o ID da unidade)

6. **Atualizar Conteúdo (Opcional)**
   ```
   PUT /conteudos/:id
   ```
   Permite editar manualmente um conteúdo gerado (onde :id é o ID do conteúdo)

7. **Gerenciar Recursos**
   - Consultar disciplina: `GET /disciplinas/{id}`
   - Consultar unidade: `GET /unidades/{id}`
   - Deletar unidade: `DELETE /unidades/{id}` (remove também os conteúdos)
   - Deletar disciplina: `DELETE /disciplinas/{id}` (remove tudo em cascata)

### Exemplo 1: Criar Disciplina
```bash 
# Criar disciplina de Língua Portuguesa para 6º Ano
curl -X POST http://localhost:3000/disciplinas \
  -H "Content-Type: application/json" \
  -d '{"disciplina_codigo": "LP", "ano_serie": "6_ANO"}'

# Listar todas as disciplinas
curl http://localhost:3000/disciplinas
```

### Exemplo 2: Obter Sugestões de Temas
```bash
# Obter sugestões de temas para a disciplina
curl http://localhost:3000/disciplinas/uuid-aqui/sugerir-temas
```

### Exemplo 3: Gerar Conteúdos (Cria Unidade + Conteúdos)
```bash
# Criar unidade e gerar plano de aula + atividade
curl -X POST http://localhost:3000/gerar/conteudos \
  -H "Content-Type: application/json" \
  -d '{
    "disciplina_id": "uuid-da-disciplina",
    "tema": "Gêneros Textuais",
    "observacoes": "Focar em textos narrativos e descritivos",
    "tipos": ["plano_de_aula", "atividade"]
  }'
```

### Exemplo 4: Listar Unidades e Conteúdos
```bash
# Listar todas as unidades de uma disciplina
curl http://localhost:3000/unidades?disciplina_id=uuid-da-disciplina

# Listar conteúdos de uma unidade específica
curl http://localhost:3000/conteudos/uuid-da-unidade
# Atualizar um conteúdo
curl -X PUT http://localhost:3000/conteudos/uuid-do-conteudo \
  -H "Content-Type: application/json" \
  -d '{"conteudo": "# Conteúdo atualizado...\n"}'```

### Exemplo 5: Fluxo Completo
```bash
# 1. Criar disciplina
DISCIPLINA_ID=$(curl -X POST http://localhost:3000/disciplinas \
  -H "Content-Type: application/json" \
  -d '{"disciplina_codigo": "LP", "ano_serie": "6_ANO"}' \
  | jq -r '.id')

# 2. Sugerir temas
curl http://localhost:3000/disciplinas/$DISCIPLINA_ID/sugerir-temas

# 3. Gerar conteúdos (cria unidade automaticamente)
RESPONSE=$(curl -X POST http://localhost:3000/gerar/conteudos \
  -H "Content-Type: application/json" \
  -d "{
    \"disciplina_id\": \"$DISCIPLINA_ID\",
    \"tema\": \"Gêneros Textuais\",
    \"tipos\": [\"plano_de_aula\", \"atividade\"]
  }")

# 4. Extrair ID da unidade criada
UNI**IDs:** Todos os IDs são UUIDs no formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
2. **Datas:** Formato ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ`
3. **Content-Type:** Todas as requisições e respostas usam `application/json`
4. **Validação:** Certifique-se de usar valores válidos para `disciplina_codigo` e `ano_serie`
5. **Performance:**
   - Sugestão de temas: 2-10 segundos
   - Geração de conteúdos: 15-30 segundos (depende da quantidade de tipos)
   - Use `/gerar/conteudos`
6. **Armazenamento:** Todo conteúdo gerado é salvo no banco e pode ser recuperado via `/conteudos`
7. **Formato:** Conteúdos gerados estão em Markdown para fácil renderização
8. **Cascata:** Deletar uma disciplina remove todas as unidades e conteúdos associados
9. **Atomicidade:** A rota `/gerar/conteudos` cria unidade e conteúdos juntos (operação atômica)

---

##  Resumo de Endpoints

| Método             | Endpoint                         | Descrição                        |
|--------------------|--------------------------------- |----------------------------------|
|   **Disciplinas**  |                                  |                                  |
| GET                | `/disciplinas`                   | Lista todas as disciplinas       |
| GET                | `/disciplinas/:id`               | Busca disciplina por ID          |
| POST               | `/disciplinas`                   | Cria nova disciplina             |
| DELETE             | `/disciplinas/:id`               | Remove disciplina                |
| GET                | `/disciplinas/:id/sugerir-temas` | Sugere temas com IA              |
|    **Conteúdos**   |                                  |                                  |
| POST               | `/gerar/conteudos`               | Cria unidade + gera conteúdos    |
| GET                | `/conteudos/:id`                 | Lista conteúdos de uma unidade   |
| PUT                | `/conteudos/:id`                 | Atualiza um conteúdo existente   |
|    **Unidades**    |                                  |                                  |
| GET                | `/unidades`                      | Lista unidades de uma disciplina |
| GET                | `/unidades/:id`                  | Busca unidade por ID             |
| DELETE             | `/unidades/:id`                  | Remove unidade e seus conteúdos  |

---

**Versão:** 2.0  
**Última Atualização:** 20