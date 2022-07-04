/*
  Warnings:

  - You are about to drop the column `filename` on the `documents` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `documents_filename_idx` ON `documents`;

-- AlterTable
ALTER TABLE `documents` DROP COLUMN `filename`;

-- CreateIndex
CREATE INDEX `documents_original_filename_idx` ON `documents`(`original_filename`);
