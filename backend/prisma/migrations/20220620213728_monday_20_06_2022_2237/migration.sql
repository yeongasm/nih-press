/*
  Warnings:

  - You are about to drop the column `tag_id` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `tag_id` on the `projects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_tag_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_tag_id_fkey`;

-- AlterTable
ALTER TABLE `articles` DROP COLUMN `tag_id`;

-- AlterTable
ALTER TABLE `projects` DROP COLUMN `tag_id`;
