/*
  Warnings:

  - You are about to drop the column `hidden` on the `tag_entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tag_entries` DROP COLUMN `hidden`;

-- AlterTable
ALTER TABLE `tags` ADD COLUMN `hidden` BOOLEAN NOT NULL DEFAULT false;
