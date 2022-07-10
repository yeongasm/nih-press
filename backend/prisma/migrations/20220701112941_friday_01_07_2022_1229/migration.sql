/*
  Warnings:

  - You are about to drop the column `is_primary_tag` on the `articles_tag_entries` table. All the data in the column will be lost.
  - You are about to drop the column `is_primary_tag` on the `document_tag_entries` table. All the data in the column will be lost.
  - You are about to drop the column `is_primary_tag` on the `project_tag_entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `articles_tag_entries` DROP COLUMN `is_primary_tag`;

-- AlterTable
ALTER TABLE `document_tag_entries` DROP COLUMN `is_primary_tag`;

-- AlterTable
ALTER TABLE `project_tag_entries` DROP COLUMN `is_primary_tag`;

-- AlterTable
ALTER TABLE `tags` ADD COLUMN `is_primary_tag` BOOLEAN NOT NULL DEFAULT false;
