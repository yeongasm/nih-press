/*
  Warnings:

  - You are about to drop the column `type` on the `tags` table. All the data in the column will be lost.
  - Made the column `tag_id` on table `documents` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_tag_id_fkey`;

-- AlterTable
ALTER TABLE `documents` MODIFY `tag_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tags` DROP COLUMN `type`;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
