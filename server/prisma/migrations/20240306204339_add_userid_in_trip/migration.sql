/*
  Warnings:

  - Added the required column `userId` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startLocationITACode" TEXT NOT NULL,
    "endLocationITACode" TEXT NOT NULL,
    "JSON" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL
);
INSERT INTO "new_Trip" ("JSON", "createdAt", "endLocationITACode", "id", "startLocationITACode") SELECT "JSON", "createdAt", "endLocationITACode", "id", "startLocationITACode" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
