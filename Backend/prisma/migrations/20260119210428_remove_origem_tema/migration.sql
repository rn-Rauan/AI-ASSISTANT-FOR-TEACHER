/*
  Warnings:

  - You are about to drop the column `origem_tema` on the `unidades` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_unidades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "disciplina_id" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "unidades_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "disciplinas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_unidades" ("created_at", "disciplina_id", "id", "tema") SELECT "created_at", "disciplina_id", "id", "tema" FROM "unidades";
DROP TABLE "unidades";
ALTER TABLE "new_unidades" RENAME TO "unidades";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
