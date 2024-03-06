/*
  Warnings:

  - You are about to drop the column `json` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `JSON` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startLocationITACode" TEXT NOT NULL,
    "endLocationITACode" TEXT NOT NULL,
    "JSON" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Trip" ("createdAt", "endLocationITACode", "id", "startLocationITACode") SELECT "createdAt", "endLocationITACode", "id", "startLocationITACode" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
