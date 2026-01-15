-- CreateTable
CREATE TABLE "disciplinas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "disciplina_codigo" TEXT NOT NULL,
    "ano_serie" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "disciplina_id" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "origem_tema" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "unidades_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "disciplinas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "conteudos_gerados" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unidade_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "conteudos_gerados_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
