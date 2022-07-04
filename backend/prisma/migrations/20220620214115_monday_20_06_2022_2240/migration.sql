/*
  Warnings:

  - You are about to drop the column `tag_id` on the `documents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_tag_id_fkey`;

-- AlterTable
ALTER TABLE `documents` DROP COLUMN `tag_id`;

-- AlterTable
ALTER TABLE `tag_entries` ADD COLUMN `hidden` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `owner_type` ENUM('article', 'project', 'document') NOT NULL;
