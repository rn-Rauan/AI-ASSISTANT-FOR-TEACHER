# Documentação da API - AI Assistant for Teacher

## Base URL
```
http://localhost:<PORT>
```

---

## 📚 Disciplinas

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

## 🎯 Temas

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

## 📖 Unidades

### 6. Listar Unidades
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

### 7. Obter Unidade por ID
**GET** `/unidades/:id`

Retorna os dados de uma unidade específica.

**Parâmetros de URL:**
- `id` (string, obrigatório): ID da unidade

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid",
  "disciplinaID": "uuid",
  "tema": "Gêneros Textuais",
  "criadoEm": "2026-01-19T00:00:00.000Z"
}
```

**Erros:**
- `400`: ID da unidade não foi fornecido
- `404`: Unidade não encontrada
- `500`: Erro interno do servidor

---

### 8. Criar Unidade
**POST** `/unidades`

Cria uma nova unidade para uma disciplina.

**Body (JSON):**
```json
{
  "disciplina_id": "uuid",
  "tema": "Gêneros Textuais"
}
```

**Campos:**
- `disciplina_id` (string, obrigatório): ID da disciplina relacionada
- `tema` (string, obrigatório): Tema da unidade

**Resposta de Sucesso (201):**
```json
{
  "id": "uuid",
  "disciplinaID": "uuid",
  "tema": "Gêneros Textuais",
  "criadoEm": "2026-01-19T00:00:00.000Z"
}
```

**Erros:**
- `400`: Campos obrigatórios não fornecidos
- `500`: Erro interno do servidor

---

### 9. Deletar Unidade
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

## 📋 Códigos de Status HTTP

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

## 📝 Tipos e Enumerações

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

## 🔄 Fluxo de Uso Recomendado

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

4. **Listar Unidades da Disciplina**
   ```
   GET /unidades?disciplina_id={id}
   ```

5. **Gerenciar Recursos Específicos**
   - Consultar: `GET /disciplinas/{id}` ou `GET /unidades/{id}`
   - Deletar: `DELETE /disciplinas/{id}` ou `DELETE /unidades/{id}`

---

## 🛠️ Exemplos de Uso

### Exemplo 1: Criar e Listar Disciplina
```bash
# Criar disciplina
curl -X POST http://localhost:3000/disciplinas \
  -H "Content-Type: application/json" \
  -d '{"disciplina_codigo": "LP", "ano_serie": "6_ANO"}'

# Listar todas
curl http://localhost:3000/disciplinas
```

### Exemplo 2: Criar e Listar Unidades
```bash
# Criar unidade
curl -X POST http://localhost:3000/unidades \
  -H "Content-Type: application/json" \
  -d '{"disciplina_id": "uuid-aqui", "tema": "Gêneros Textuais"}'

# Listar unidades da disciplina
curl http://localhost:3000/unidades?disciplina_id=uuid-aqui
```

### Exemplo 3: Sugerir Temas
```bash
# Obter sugestões de temas
curl http://localhost:3000/disciplinas/uuid-aqui/sugerir-temas
```

---

## ⚠️ Notas Importantes

1. Todos os IDs são UUIDs no formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
2. O formato de data retornado é ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ`
3. Todas as requisições e respostas usam `Content-Type: application/json`
4. Certifique-se de que os valores de `disciplina_codigo` e `ano_serie` sejam válidos
5. A funcionalidade de sugestão de temas utiliza IA e pode demorar alguns segundos

---

**Versão:** 1.0  
**Última Atualização:** 19 de janeiro de 2026
