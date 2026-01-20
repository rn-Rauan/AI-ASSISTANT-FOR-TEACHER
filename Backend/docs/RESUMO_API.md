# Resumo da API - AI Assistant for Teacher

Este documento fornece uma visão geral e concisa dos endpoints da API, focando no essencial para o desenvolvimento do frontend.

## Base URL

---

## Endpoints

### 📚 Disciplinas

- **`GET /disciplinas`**
  - **Descrição:** Lista todas as disciplinas cadastradas.
  - **Resposta de Sucesso (200):**
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

- **`GET /disciplinas/:id`**
  - **Descrição:** Retorna os dados de uma disciplina específica.
  - **Parâmetros:** `id` (na URL).

- **`POST /disciplinas`**
  - **Descrição:** Cria uma nova disciplina.
  - **Body (JSON):**
    ```json
    {
      "disciplina_codigo": "LP",
      "ano_serie": "6_ANO"
    }
    ```

- **`DELETE /disciplinas/:id`**
  - **Descrição:** Remove uma disciplina.
  - **Parâmetros:** `id` (na URL).

- **`GET /disciplinas/:id/sugerir-temas`**
  - **Descrição:** Gera sugestões de temas para uma disciplina usando IA.
  - **Parâmetros:** `id` (na URL).
  - **Resposta de Sucesso (200):**
    ```json
    {
      "temas": ["Tema 1", "Tema 2", "Tema 3"]
    }
    ```

---

### 📖 Unidades

- **`GET /unidades`**
  - **Descrição:** Lista as unidades de uma disciplina.
  - **Query Params:** `disciplina_id` (obrigatório).
  - **Exemplo:** `/unidades?disciplina_id=uuid-da-disciplina`

- **`GET /unidades/:id`**
  - **Descrição:** Retorna os dados de uma unidade específica.
  - **Parâmetros:** `id` (na URL).

- **`POST /unidades`**
  - **Descrição:** Cria uma nova unidade para uma disciplina.
  - **Body (JSON):**
    ```json
    {
      "disciplina_id": "uuid-da-disciplina",
      "tema": "Gêneros Textuais"
    }
    ```

- **`DELETE /unidades/:id`**
  - **Descrição:** Remove uma unidade.
  - **Parâmetros:** `id` (na URL).

---

## 📝 Tipos e Enumerações Essenciais

### Códigos de Disciplina (`disciplina_codigo`)
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

### Ano/Série (`ano_serie`)
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

## ⚠️ Notas Rápidas

1.  Todos os IDs são **UUIDs**.
2.  O formato de data é **ISO 8601** (`YYYY-MM-DDTHH:mm:ss.sssZ`).
3.  O `Content-Type` para `POST` é `application/json`.
4.  A sugestão de temas (`/sugerir-temas`) pode levar alguns segundos para responder.