/*
  Warnings:

  - You are about to drop the column `name` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Trip` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startLocationITACode" TEXT NOT NULL,
    "endLocationITACode" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Trip" ("createdAt", "endLocationITACode", "id", "json", "startLocationITACode") SELECT "createdAt", "endLocationITACode", "id", "json", "startLocationITACode" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
