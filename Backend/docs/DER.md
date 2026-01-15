# DER – Diagrama Entidade-Relacionamento

## 1. Visão Geral do Modelo

O sistema adota um modelo hierárquico para organização dos materiais didáticos, garantindo rastreabilidade entre disciplinas, unidades de ensino e conteúdos gerados por Inteligência Artificial.

### Relacionamentos


- Uma **Disciplina** agrupa conteúdos de uma matéria em um determinado ano/série.
- Uma **Unidade** representa um tema ou tópico específico dentro da disciplina.
- Cada **Unidade** pode gerar múltiplos conteúdos didáticos, como plano de aula, atividade avaliativa e slides.

---

## 2. Dicionário de Dados

### Entidade: disciplinas

Armazena as disciplinas disponíveis no sistema, associadas a um ano ou série escolar.

| Campo             | Tipo      | Restrições             | Descrição                                |
|-------------------|-----------|------------------------|------------------------------------------|
| id                | UUID      | PK, Unique             | Identificador único da disciplina        |
| disciplina_codigo | String    | Not Null               | Código da disciplina (ex: MAT, LP, HIS)  |
| ano_serie         | String    | Not Null               | Ano ou série escolar (ex: 6º Ano, 1º EM) |
| created_at        | DateTime  | Default: now()         | Data de criação do registro              |

---

### Entidade: unidades

Representa os temas ou tópicos de estudo pertencentes a uma disciplina.

| Campo        | Tipo     | Restrições             | Descrição                                |
|--------------|----------|------------------------|------------------------------------------|
| id           | UUID     | PK, Unique             | Identificador único da unidade           |
| disciplina_id| UUID     | FK → disciplinas.id    | Disciplina à qual a unidade pertence     |
| tema         | String   | Not Null               | Tema ou título da unidade                |
| origem_tema  | String   | bncc | manual          | Indica tema BNCC ou tema manual          |
| created_at   | DateTime | Default: now()         | Data de criação do registro              |

---

### Entidade: conteudos_gerados

Armazena os materiais didáticos produzidos pela Inteligência Artificial.

| Campo      | Tipo     | Restrições                                   | Descrição                           |
|------------|----------|----------------------------------------------|-------------------------------------|
| id         | UUID     | PK, Unique                                   | Identificador único do conteúdo     |
| unidade_id | UUID     | FK → unidades.id                             | Unidade à qual o conteúdo pertence  |
| tipo       | String   | plano_aula  | atividade_avaliativa  | slides | Tipo do conteúdo gerado             |
| conteudo   | Text     | Not Null                                     | Conteúdo textual gerado pela IA     |
| created_at | DateTime | Default: now()                               | Data de criação do registro         |

---

## 3. Regras de Negócio Associadas ao Modelo

- **Integridade Referencial**  
  Ao excluir uma disciplina, todas as unidades e conteúdos gerados associados devem ser removidos automaticamente (Cascade Delete).

- **Validação de Tipos**  
  Apesar de `origem_tema` e `tipo` serem armazenados como `String`, a camada de Application é responsável por validar os valores permitidos, evitando inconsistências.

- **Persistência de Conteúdo Gerado por IA**  
  O campo `conteudo` deve suportar textos extensos, pois armazena planos de aula completos, atividades avaliativas detalhadas e possíveis materiais complementares.

---

## 4. Observações Arquiteturais

- Dados normativos como BNCC e Diretrizes do MEC **não são persistidos neste modelo**, sendo mantidos em arquivos JSON estáticos versionados no código-fonte.
- O modelo foi projetado para um sistema de usuário único, conforme especificado no edital.
