/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Prompt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Prompt_title_key" ON "Prompt"("title");
